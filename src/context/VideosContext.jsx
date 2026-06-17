import { createContext, useContext, useEffect, useState } from 'react';
import { VIDEOS as INITIAL_VIDEOS } from '../data/videos';

const VideosContext = createContext(null);
// Версия хранилища: при изменении схемы данных меняем число,
// чтобы старый кеш в localStorage сбросился и подгрузились новые поля.
const STORAGE_KEY = 'ifbest-videos-v2';

/**
 * Глобальное хранилище видео.
 * Хранит и начальный мок-датасет, и пользовательские загрузки.
 * Сохраняется в localStorage — чтобы загруженные видео не пропадали
 * после перезагрузки страницы.
 *
 * Предоставляет:
 *  - videos — текущий список
 *  - addVideo(video) — добавить новое (используется в Upload)
 *  - getVideoById(id), getSimilarVideos(id, limit)
 *  - hasProcessing — есть ли видео в обработке (для оранжевой точки в шапке)
 *  - hasError — есть ли видео с ошибкой загрузки (для красной точки в шапке)
 */
export function VideosProvider({ children }) {
  const [videos, setVideos] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_VIDEOS;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* fallthrough */ }
    }
    return INITIAL_VIDEOS;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, [videos]);

  const addVideo = (video) => {
    setVideos((prev) => [video, ...prev]);

    // Имитация фоновой обработки: через 30 секунд переводим видео
    // в ready (85% случаев) или error (15%). Это позволяет на апробации
    // показать смену цвета индикатора: оранжевый (обработка) →
    // зелёный (готово) или красный (ошибка).
    if (video.status === 'processing') {
      setTimeout(() => {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id
              ? { ...v, status: Math.random() < 0.85 ? 'ready' : 'error' }
              : v
          )
        );
      }, 30000);
    }
  };

  const getVideoById = (id) => videos.find((v) => v.id === id);

  const getSimilarVideos = (id, limit = 3) => {
    const target = getVideoById(id);
    if (!target) return [];
    return videos
      .filter((v) => v.id !== id && v.department === target.department && v.status === 'ready')
      .slice(0, limit);
  };

  const hasProcessing = videos.some((v) => v.status === 'processing');
  const hasError = videos.some((v) => v.status === 'error');

  const resetVideos = () => {
    setVideos(INITIAL_VIDEOS);
  };

  return (
    <VideosContext.Provider
      value={{
        videos, addVideo, getVideoById, getSimilarVideos,
        hasProcessing, hasError, resetVideos
      }}
    >
      {children}
    </VideosContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideosContext);
  if (!ctx) throw new Error('useVideos must be used inside VideosProvider');
  return ctx;
}
