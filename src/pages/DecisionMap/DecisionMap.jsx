import { useMemo, useState, useRef, useEffect } from 'react';
import { VIDEOS } from '../../data/videos';
import { generateDecisionMap } from '../../data/decisionMap';
import { formatRelativeTime } from '../../utils/formatters';
import { SearchIcon } from '../../components/Icons/Icons';
import './DecisionMap.css';

const MARKER_COLORS = {
  red: 'var(--color-marker-red)',
  green: 'var(--color-marker-green)',
  blue: 'var(--color-marker-blue)',
  yellow: 'var(--color-marker-yellow)',
};

/**
 * Карта решений.
 * Точное соответствие макета "Карта решений L black":
 *  - сверху панель выбора видео (поиск + чекбоксы + кнопка "Построить")
 *  - снизу — дерево узлов с цветными маркерами и SVG-стрелками
 */
export default function DecisionMap() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [built, setBuilt] = useState(false);
  // Сохраняем именно те узлы, которые сгенерировались на момент клика "Построить".
  // Иначе при дальнейшей правке выбора видео карта бы прыгала без пересборки.
  const [generatedNodes, setGeneratedNodes] = useState([]);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [edges, setEdges] = useState([]);

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return VIDEOS.slice(0, 8);
    const q = search.trim().toLowerCase();
    return VIDEOS.filter((v) => v.title.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBuild = () => {
    if (selectedIds.size === 0) return;
    // Сбрасываем старые стрелки сразу — чтобы между рендерами не мелькнули
    // координаты от прошлой карты.
    setEdges([]);
    setGeneratedNodes(generateDecisionMap(Array.from(selectedIds)));
    setBuilt(true);
  };

  // Группировка узлов по уровням
  const levels = useMemo(() => {
    if (!built || generatedNodes.length === 0) return [];
    const map = new Map();
    generatedNodes.forEach((n) => {
      if (!map.has(n.level)) map.set(n.level, []);
      map.get(n.level).push(n);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [built, generatedNodes]);

  // Расчёт рёбер (стрелок) между узлами после рендера.
  // ref-коллбеки уже выставили актуальные DOM-элементы в nodeRefs.current
  // к моменту запуска этого эффекта; стрелки рисуем относительно контейнера.
  useEffect(() => {
    if (!built || generatedNodes.length === 0) return;

    const computeEdges = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerBox = container.getBoundingClientRect();

      const newEdges = [];
      generatedNodes.forEach((node) => {
        node.parents.forEach((parentId) => {
          const parentEl = nodeRefs.current[parentId];
          const childEl = nodeRefs.current[node.id];
          if (!parentEl || !childEl) return;
          const pb = parentEl.getBoundingClientRect();
          const cb = childEl.getBoundingClientRect();
          newEdges.push({
            id: `${parentId}-${node.id}`,
            x1: pb.left - containerBox.left + pb.width / 2,
            y1: pb.bottom - containerBox.top,
            x2: cb.left - containerBox.left + cb.width / 2,
            y2: cb.top - containerBox.top,
          });
        });
      });
      setEdges(newEdges);
    };

    // Даём React один тик на установку ref'ов перед расчётом
    const raf = requestAnimationFrame(computeEdges);
    window.addEventListener('resize', computeEdges);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', computeEdges);
    };
  }, [built, generatedNodes, levels]);

  return (
    <div className="dmap">
      <h1 className="dmap__title">Управление картой решений</h1>

      {/* Панель выбора видео */}
      <section className="dmap__selector surface">
        <h2 className="dmap__selector-title">Построение карты решений</h2>

        <div className="dmap__search">
          <SearchIcon size={16} />
          <input
            type="search"
            className="dmap__search-input"
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Поиск видео для карты"
          />
        </div>

        <ul className="dmap__videos">
          {filteredVideos.map((v) => (
            <li key={v.id}>
              <label className="dmap__video">
                <input
                  type="checkbox"
                  checked={selectedIds.has(v.id)}
                  onChange={() => toggleSelect(v.id)}
                />
                <div className="dmap__video-info">
                  <div className="dmap__video-title">{v.title}</div>
                  <div className="dmap__video-meta">
                    {v.department} • {formatRelativeTime(v.uploadedAt)}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>

        <div className="dmap__selector-footer">
          <span className="dmap__count">Всего выбрано: {selectedIds.size}</span>
          <button
            className="btn btn-primary"
            onClick={handleBuild}
            disabled={selectedIds.size === 0}
          >
            Построить
          </button>
        </div>
      </section>

      {/* Сама карта решений */}
      {built && (
        <section className="dmap__map">
          <h2 className="dmap__map-title">Карта решений</h2>
          <p className="dmap__map-subtitle">
            {selectedIds.size} видео, {Math.max(0, generatedNodes.length - 1)} решений
          </p>

          <div className="dmap__tree" ref={containerRef}>
            <svg className="dmap__edges" aria-hidden="true">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="6"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const midY = (edge.y1 + edge.y2) / 2;
                const path = `M ${edge.x1} ${edge.y1} L ${edge.x1} ${midY} L ${edge.x2} ${midY} L ${edge.x2} ${edge.y2}`;
                return (
                  <path
                    key={edge.id}
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>

            {levels.map(([level, nodes]) => (
              <div key={level} className="dmap__level">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="dmap__node"
                    ref={(el) => { nodeRefs.current[node.id] = el; }}
                  >
                    <span
                      className="dmap__node-marker"
                      style={{ backgroundColor: MARKER_COLORS[node.marker] }}
                      aria-hidden="true"
                    />
                    <span className="dmap__node-label">{node.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
