import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../../components/VideoCard/VideoCard';
import { VideoGridSkeleton } from '../../components/Skeleton/Skeleton';
import FiltersPanel from '../../components/FiltersPanel/FiltersPanel';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import Pagination from '../../components/Pagination/Pagination';
import { useAuth } from '../../context/AuthContext';
import { useVideos } from '../../context/VideosContext';
import './Home.css';

const PAGE_SIZE = 9;

/**
 * Главная страница — библиотека видео.
 * Реализует паттерны из главы 2.7:
 *  - многоуровневая фильтрация (отдел, дата, теги)
 *  - сортировка
 *  - пагинация (по 9 на страницу, кратно сетке 3×3)
 *  - поиск по подстроке
 *  - фильтрация по роли (employee видит только свои и публичные)
 *
 * Источник данных — VideosContext, поэтому загруженные пользователем видео
 * сразу появляются на главной (со статусом 'processing').
 */
export default function Home() {
  const { user, permissions } = useAuth();
  const { videos } = useVideos();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    departments: [],
    tags: [],
    dateFrom: '',
    dateTo: '',
  });
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters, query, sort]);

  // 1. Фильтрация по роли
  const visibleByRole = useMemo(() => {
    if (!permissions) return videos;
    if (permissions.scope === 'all') return videos;
    if (permissions.scope === 'department') {
      return videos.filter((v) => v.department === user.department);
    }
    return videos.filter((v) => v.visibility === 'public' || v.uploader === user.id);
  }, [videos, permissions, user]);

  // 2. Фильтры пользователя
  const filtered = useMemo(() => {
    let result = visibleByRole;
    if (filters.departments.length) {
      result = result.filter((v) => filters.departments.includes(v.department));
    }
    if (filters.tags.length) {
      result = result.filter((v) => v.tags.some((t) => filters.tags.includes(t)));
    }
    if (filters.dateFrom) {
      result = result.filter((v) => new Date(v.uploadedAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter((v) => new Date(v.uploadedAt) <= new Date(filters.dateTo));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [visibleByRole, filters, query]);

  // 3. Сортировка
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case 'date-asc':
        return arr.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
      case 'date-desc':
        return arr.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      case 'title':
        return arr.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
      case 'duration':
        return arr.sort((a, b) => b.duration - a.duration);
      case 'views':
        return arr.sort((a, b) => b.views - a.views);
      default:
        return arr;
    }
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  );

  const sectionTitle = query.trim()
    ? `Результаты по запросу: «${query}»`
    : permissions?.scope === 'department'
    ? user.department
    : permissions?.scope === 'own-and-public'
    ? 'Доступные видео'
    : 'Вся библиотека';

  return (
    <div className="home">
      {/* Верхний toolbar: фильтры/сортировка слева, пагинация по центру, баланс справа */}
      <div className="home__toolbar">
        <div className="home__toolbar-left">
          <SortDropdown value={sort} onChange={setSort} />
          <FiltersPanel filters={filters} onChange={setFilters} />
        </div>
        <div className="home__toolbar-center">
          <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
        <div className="home__toolbar-right" aria-hidden="true" />
      </div>

      <h1 className="home__title">{sectionTitle}</h1>

      {(filters.departments.length > 0 || filters.tags.length > 0) && (
        <div className="home__active-filters">
          {filters.departments.map((d) => (
            <button
              key={d}
              className="home__chip"
              onClick={() => setFilters({ ...filters, departments: filters.departments.filter((x) => x !== d) })}
            >
              {d} ×
            </button>
          ))}
          {filters.tags.map((t) => (
            <button
              key={t}
              className="home__chip"
              onClick={() => setFilters({ ...filters, tags: filters.tags.filter((x) => x !== t) })}
            >
              #{t} ×
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <VideoGridSkeleton count={9} />
      ) : pageItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="home__grid">
          {pageItems.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="home__empty">
      <div className="home__empty-icon" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h2 className="home__empty-title">Ничего не найдено</h2>
      <p className="home__empty-text">
        Попробуйте изменить фильтры или сбросить поисковый запрос
      </p>
    </div>
  );
}
