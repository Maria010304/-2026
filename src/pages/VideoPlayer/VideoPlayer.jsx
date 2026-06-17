import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVideos } from '../../context/VideosContext';
import { generateTranscript, findActivePhraseIndex } from '../../data/transcript';
import { formatTime, formatRelativeTime } from '../../utils/formatters';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import './VideoPlayer.css';

// Открытое демо-видео из общедоступного CDN
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// Постер плеера — детерминированная картинка по id видео.
// Используется как заглушка до начала воспроизведения.
const getPosterUrl = (videoId) => `https://picsum.photos/seed/${videoId}/1280/720`;

/**
 * Страница видеоплеера.
 * Реализует центральную UX-фишку: интерактивная транскрипция
 * (главы 1.4 и 2.5 диплома).
 * - Клик по фразе перематывает видео к этому моменту.
 * - При воспроизведении текущая фраза подсвечивается и автопрокручивается в видимость.
 */
export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideoById } = useVideos();
  const video = getVideoById(id);

  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  // Реальная длительность видео — берётся из самого элемента <video>
  // через событие onLoadedMetadata. Заявленная длительность из мок-данных
  // может не совпадать с реальной (особенно для пользовательских загрузок,
  // где она = 0), поэтому транскрипт распределяем именно по реальному времени.
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const transcriptRef = useRef(null);

  // Транскрипт распределяется по фактической длительности.
  // Пока метаданные не загружены — используем заявленную из мок-данных
  // как fallback, чтобы плеер мог отрисоваться сразу.
  const transcript = useMemo(() => {
    const duration = videoDuration > 0 ? videoDuration : (video?.duration > 0 ? video.duration : 600);
    return generateTranscript(duration);
  }, [video, videoDuration]);

  const activeIdx = findActivePhraseIndex(transcript, currentTime);

  // Эффект «скелетон → готово» — глава 2.4 диплома
  useEffect(() => {
    setLoading(true);
    setCurrentTime(0);
    setVideoDuration(0);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [id]);

  // Авто-прокрутка списка транскрипта к активной фразе
  useEffect(() => {
    if (!transcriptRef.current) return;
    const activeEl = transcriptRef.current.querySelector('.transcript__item--active');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIdx]);

  if (!video) {
    return (
      <div className="player__not-found">
        <h2>Видео не найдено</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  const handlePhraseClick = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play().catch(() => { /* пользователь не взаимодействовал — игнорируем */ });
    }
  };

  return (
    <div className="player">
      <div className="player__main">
        {loading ? (
          <Skeleton height="0" style={{ aspectRatio: '16 / 9', borderRadius: 'var(--radius-lg)' }} />
        ) : (
          <video
            ref={videoRef}
            className="player__video"
            controls
            preload="metadata"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              // Реальная длительность доступна, как только браузер прочитал
              // метаданные файла. Используем её для распределения фраз транскрипта.
              const dur = e.currentTarget.duration;
              if (Number.isFinite(dur) && dur > 0) {
                setVideoDuration(dur);
              }
            }}
            poster={getPosterUrl(video.id)}
            aria-label={video.title}
          >
            <source src={DEMO_VIDEO_URL} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        )}
      </div>

      <aside className="player__transcript" aria-label="Транскрипт">
        <ol className="transcript" ref={transcriptRef}>
          {transcript.map((phrase, idx) => (
            <li key={phrase.id}>
              <button
                type="button"
                className={`transcript__item ${idx === activeIdx ? 'transcript__item--active' : ''}`}
                onClick={() => handlePhraseClick(phrase.time)}
              >
                <span className="transcript__time">{formatTime(phrase.time)}</span>
                <span className="transcript__text">{phrase.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className="player__info">
        <h1 className="player__title">{video.title}</h1>
        <div className="player__meta">
          <span>{video.department}</span>
          <span className="player__sep" aria-hidden="true">•</span>
          <span>{formatRelativeTime(video.uploadedAt)}</span>
        </div>
        {video.tags && video.tags.length > 0 && (
          <div className="player__tags">
            {video.tags.map((tag) => (
              <span key={tag} className="player__tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="player__actions">
          <Link to={`/summary/${video.id}`} className="btn btn-primary">
            Открыть Summary
          </Link>
        </div>
      </div>
    </div>
  );
}
