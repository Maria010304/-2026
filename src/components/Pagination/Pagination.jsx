import { ChevronLeftIcon, ChevronRightIcon } from '../Icons/Icons';
import './Pagination.css';

/**
 * Пагинация с эллипсисом, стрелками с обеих сторон.
 * Формула: ‹  1 2 3 4 5 6 7 … 15 16 17  ›
 */
export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = getPaginationItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Пагинация">
      <ul className="pagination__list">
        <li>
          <button
            type="button"
            className="pagination__arrow"
            onClick={() => onChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Предыдущая страница"
          >
            <ChevronLeftIcon size={18} />
          </button>
        </li>
        {pages.map((item, idx) => (
          <li key={idx}>
            {item === '...' ? (
              <span className="pagination__ellipsis" aria-hidden="true">…</span>
            ) : (
              <button
                type="button"
                className={`pagination__page ${item === currentPage ? 'is-active' : ''}`}
                onClick={() => onChange(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Страница ${item}`}
              >
                {item}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="pagination__arrow"
            onClick={() => onChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Следующая страница"
          >
            <ChevronRightIcon size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

function getPaginationItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const start = [1, 2, 3, 4, 5, 6, 7].filter((n) => n <= total - 3);
  const end = [total - 2, total - 1, total];
  if (current <= 7) {
    return [...start, '...', ...end];
  }
  if (current >= total - 3) {
    return [1, 2, '...', ...end];
  }
  return [1, 2, '...', current - 1, current, current + 1, '...', total];
}
