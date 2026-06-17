import { useEffect, useRef, useState } from 'react';
import { ALL_DEPARTMENTS, ALL_TAGS } from '../../data/videos';
import { FilterIcon } from '../Icons/Icons';
import './FiltersPanel.css';

/**
 * Панель фильтров: отдел (чекбоксы), диапазон дат, теги.
 * Точное соответствие макета "Фильтры".
 */
export default function FiltersPanel({ filters, onChange }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Закрытие при клике вне панели
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggleDepartment = (dept) => {
    const next = filters.departments.includes(dept)
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept];
    onChange({ ...filters, departments: next });
  };

  const toggleTag = (tag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: next });
  };

  const activeCount =
    filters.departments.length + filters.tags.length +
    (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0);

  return (
    <div className="filters" ref={panelRef}>
      <button
        type="button"
        className={`filters__trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <FilterIcon size={18} />
        {activeCount > 0 && (
          <span className="filters__badge">{activeCount}</span>
        )}
      </button>

      {open && (
        <div className="filters__panel" role="dialog" aria-label="Фильтры">
          <div className="filters__header">
            <FilterIcon size={18} />
            <span>Фильтры</span>
          </div>

          <div className="filters__section">
            <div className="filters__section-title">Отдел</div>
            {ALL_DEPARTMENTS.map((dept) => (
              <label key={dept} className="filters__checkbox">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(dept)}
                  onChange={() => toggleDepartment(dept)}
                />
                <span>{dept}</span>
              </label>
            ))}
          </div>

          <div className="filters__section">
            <div className="filters__section-title">Дата</div>
            <div className="filters__date-range">
              <input
                type="date"
                className="filters__date"
                value={filters.dateFrom || ''}
                onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                aria-label="Дата от"
              />
              <span>—</span>
              <input
                type="date"
                className="filters__date"
                value={filters.dateTo || ''}
                onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                aria-label="Дата до"
              />
            </div>
          </div>

          <div className="filters__section">
            <div className="filters__section-title">Теги</div>
            <div className="filters__tags">
              {ALL_TAGS.slice(0, 9).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`filters__tag ${filters.tags.includes(tag) ? 'is-active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              className="filters__reset"
              onClick={() => onChange({ departments: [], tags: [], dateFrom: '', dateTo: '' })}
            >
              Сбросить все
            </button>
          )}
        </div>
      )}
    </div>
  );
}
