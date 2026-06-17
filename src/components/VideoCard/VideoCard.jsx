import { Link } from 'react-router-dom';
import { MoreIcon } from '../Icons/Icons';
import { formatDuration, formatRelativeTime } from '../../utils/formatters';
import './VideoCard.css';

/**
 * Получает URL превью.
 * Берём с picsum.photos — там детерминированные изображения по seed,
 * поэтому каждое видео всегда получает одно и то же фото.
 * Для видео в обработке или с ошибкой превью не показываем — серая заглушка
 * с поясняющим бейджем.
 */
function getPreviewUrl(video) {
  if (video.status !== 'ready') return null;
  return `https://picsum.photos/seed/${video.id}/640/360`;
}

/**
 * Карточка видео.
 * По макету: превью, название, отдел, время загрузки, длительность.
 * Клик по карточке ведёт в плеер.
 */
export default function VideoCard({ video, onContextMenu }) {
  const previewUrl = getPreviewUrl(video);

  return (
    <article className="video-card">
      <Link to={`/video/${video.id}`} className="video-card__preview" aria-label={video.title}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="video-card__preview-img"
            loading="lazy"
          />
        ) : (
          <div className="video-card__preview-bg" />
        )}
        {video.status === 'processing' && (
          <span className="video-card__badge video-card__badge--processing">
            обрабатывается
          </span>
        )}
        {video.status === 'error' && (
          <span className="video-card__badge video-card__badge--error">
            ошибка загрузки
          </span>
        )}
        {video.status === 'ready' && video.duration > 0 && (
          <span className="video-card__duration" aria-hidden="true">
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </span>
        )}
      </Link>
      <div className="video-card__body">
        <div className="video-card__avatar" aria-hidden="true" />
        <div className="video-card__meta">
          <Link to={`/video/${video.id}`} className="video-card__title">
            {video.title.length > 50 ? video.title.slice(0, 50) + '…' : video.title}
          </Link>
          <div className="video-card__department">{video.department}</div>
          <div className="video-card__sub">
            {formatRelativeTime(video.uploadedAt)}
            {video.duration > 0 && (
              <>
                <span className="video-card__sep" aria-hidden="true">•</span>
                {formatDuration(video.duration)}
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          className="video-card__more"
          aria-label="Действия"
          onClick={(e) => { e.preventDefault(); onContextMenu?.(video); }}
        >
          <MoreIcon size={18} />
        </button>
      </div>
    </article>
  );
}
