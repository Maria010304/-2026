import './Skeleton.css';

/**
 * Универсальный блок-скелетон.
 * Используется на всех страницах для индикации загрузки
 * (соответствует главе 2.4 диплома, рис. 2.4.1).
 */
export function Skeleton({ width = '100%', height = '20px', radius = 'var(--radius-sm)', style }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/**
 * Скелет карточки видео — совпадает по структуре с настоящей.
 */
export function VideoCardSkeleton() {
  return (
    <div className="video-card-skeleton">
      <Skeleton height="0" style={{ aspectRatio: '16 / 9', borderRadius: 'var(--radius-lg)' }} />
      <div className="video-card-skeleton__body">
        <Skeleton width="36px" height="36px" radius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton height="16px" style={{ marginBottom: '8px' }} />
          <Skeleton height="12px" width="60%" style={{ marginBottom: '6px' }} />
          <Skeleton height="12px" width="80%" />
        </div>
      </div>
    </div>
  );
}

/**
 * Сетка скелетонов карточек.
 */
export function VideoGridSkeleton({ count = 9 }) {
  return (
    <div className="video-grid-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
