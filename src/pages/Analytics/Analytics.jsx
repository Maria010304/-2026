import { KPI_METRICS, UPLOADS_CHART, USERS_ACTIVITY_CHART, DEPARTMENTS_ACTIVITY } from '../../data/analytics';
import { formatNumber } from '../../utils/formatters';
import { ChevronRightIcon } from '../../components/Icons/Icons';
import './Analytics.css';

/**
 * Страница аналитики (макет "менеджер L black").
 *  - 4 KPI-карточки с акцентным градиентом
 *  - 2 линейных графика (загрузки и активность пользователей)
 *  - горизонтальная диаграмма активности отделов
 */
export default function Analytics() {
  return (
    <div className="analytics">
      <h1 className="analytics__title">Аналитика</h1>

      <div className="analytics__kpis">
        {KPI_METRICS.map((kpi) => (
          <article key={kpi.id} className="kpi-card">
            <div className="kpi-card__label">{kpi.label}:</div>
            <div className="kpi-card__value">{formatNumber(kpi.value)}</div>
            <div className="kpi-card__change">{kpi.change}</div>
          </article>
        ))}
      </div>

      <div className="analytics__charts">
        <ChartCard title="График загрузок" data={UPLOADS_CHART} />
        <ChartCard title="Активность пользователей" data={USERS_ACTIVITY_CHART} />
      </div>

      <section className="analytics__activity surface">
        <h2 className="activity__title">Активность</h2>
        <DepartmentsBarChart data={DEPARTMENTS_ACTIVITY} />
      </section>
    </div>
  );
}

/**
 * Карточка с линейным графиком (SVG).
 */
function ChartCard({ title, data }) {
  const W = 480;
  const H = 200;
  const padding = { top: 20, right: 20, bottom: 25, left: 35 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const yMax = Math.ceil(maxValue / 55) * 55;
  const ySteps = [55, 110, 165, yMax];

  // Координаты точек графика
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerW;
    const y = padding.top + innerH - (d.value / yMax) * innerH;
    return { x, y, ...d };
  });

  // Строим путь линии графика
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Подписи по X — показываем каждую седьмую дату
  const xLabels = data.filter((_, i) => i % 7 === 0 || i === data.length - 1);

  return (
    <article className="chart-card">
      <header className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        <ChevronRightIcon size={20} />
      </header>
      <div className="chart-card__body">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-card__svg" preserveAspectRatio="xMidYMid meet">
          {/* Горизонтальные линии сетки */}
          {ySteps.map((step) => {
            const y = padding.top + innerH - (step / yMax) * innerH;
            return (
              <g key={step}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={W - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                />
                <text x={padding.left - 6} y={y + 4} textAnchor="end" fontSize="11" fill="currentColor">
                  {step}
                </text>
              </g>
            );
          })}
          {/* Подписи по X */}
          {xLabels.map((d, i) => {
            const x = padding.left + (data.indexOf(d) / (data.length - 1)) * innerW;
            return (
              <text key={i} x={x} y={H - 5} textAnchor="middle" fontSize="11" fill="currentColor">
                {d.date}
              </text>
            );
          })}
          {/* Сама линия графика */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </article>
  );
}

/**
 * Горизонтальная диаграмма активности отделов.
 */
function DepartmentsBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div key={d.name} className="bar-chart__row">
          <div className="bar-chart__label">{d.name}</div>
          <div className="bar-chart__track">
            <div
              className="bar-chart__bar"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <div className="bar-chart__value">{d.count} видео</div>
        </div>
      ))}
    </div>
  );
}
