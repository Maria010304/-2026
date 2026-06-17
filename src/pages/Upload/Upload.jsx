import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast';
import { useAuth } from '../../context/AuthContext';
import { useVideos } from '../../context/VideosContext';
import { ALL_DEPARTMENTS } from '../../data/videos';
import './Upload.css';

/**
 * Страница загрузки видео.
 * Два состояния (как в макетах):
 *  Шаг 1 — Drag&Drop зона (макет "Страница загрузки видео 1 L black")
 *  Шаг 2 — превью + прогресс + форма метаданных (макет "Страница загрузки видео 2 L black")
 */
export default function Upload() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { addVideo } = useVideos();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [meta, setMeta] = useState({
    department: user?.department || '',
    visibility: 'public',
    title: '',
    description: '',
  });

  // Очистка object URL при размонтировании, чтобы не утекала память
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      showToast('Пожалуйста, выберите видеофайл', 'error');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    // Имитация загрузки на сервер прогрессом
    simulateUpload();
  };

  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 250);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (progress < 100) {
      showToast('Дождитесь завершения загрузки', 'warning');
      return;
    }
    if (!meta.title.trim()) {
      showToast('Укажите название видео', 'error');
      return;
    }

    // Создаём новое видео со статусом 'processing' и добавляем в общий список.
    // По задумке — оно появится на главной с оранжевой меткой "обрабатывается",
    // а индикатор в шапке станет оранжевым (имитация фоновой обработки).
    const newVideo = {
      id: `v-user-${Date.now()}`,
      title: meta.title.trim(),
      department: meta.department || user?.department || 'ИТ-отдел',
      duration: 0,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      views: 0,
      tags: [],
      uploader: user?.id,
      visibility: meta.visibility,
      description: meta.description.trim() ||
        'Описание появится после завершения обработки видео.',
    };
    addVideo(newVideo);

    showToast('Видео загружено и отправлено в обработку', 'success');
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="upload">
      <h1 className="upload__title">Загрузка видео</h1>

      {!file ? (
        <div
          className={`upload__dropzone ${isDragging ? 'upload__dropzone--active' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3v12" />
            <polyline points="7 10 12 15 17 10" />
            <path d="M5 17v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
          </svg>
          <p className="upload__dropzone-text">
            Перетащите сюда файл<br />или
          </p>
          <button type="button" className="upload__choose-btn">
            Выберите файл
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <form className="upload__form" onSubmit={handleSubmit}>
          <div className="upload__preview">
            {previewUrl ? (
              <video src={previewUrl} className="upload__preview-video" muted />
            ) : (
              <div className="upload__preview-placeholder" />
            )}
          </div>

          <div className="upload__progress" aria-label="Прогресс загрузки">
            <div
              className="upload__progress-bar"
              style={{ width: `${Math.min(100, progress)}%` }}
              role="progressbar"
              aria-valuenow={Math.floor(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="upload__row">
            <select
              className="upload__select"
              value={meta.department}
              onChange={(e) => setMeta({ ...meta, department: e.target.value })}
              aria-label="Отдел"
            >
              <option value="">Отдел</option>
              {ALL_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="upload__select"
              value={meta.visibility}
              onChange={(e) => setMeta({ ...meta, visibility: e.target.value })}
              aria-label="Видимость"
            >
              <option value="public">Публичный</option>
              <option value="private">Приватный</option>
            </select>
          </div>

          <input
            type="text"
            className="upload__input"
            placeholder="Название видео"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          />

          <textarea
            className="upload__input upload__textarea"
            placeholder="Описание"
            value={meta.description}
            onChange={(e) => setMeta({ ...meta, description: e.target.value })}
            rows={5}
          />

          <div className="upload__actions">
            <button type="submit" className="btn btn-primary">
              Загрузить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
