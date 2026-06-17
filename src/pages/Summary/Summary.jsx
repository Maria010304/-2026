import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVideos } from '../../context/VideosContext';
import { formatRelativeTime } from '../../utils/formatters';
import VideoCard from '../../components/VideoCard/VideoCard';
import './Summary.css';

const TABS = [
  { id: 'summary', label: 'Краткое содержание' },
  { id: 'participants', label: 'Участники' },
  { id: 'decisions', label: 'Решения' },
  { id: 'next', label: 'Следующие шаги' },
];

/**
 * Страница Summary — обобщённое описание видео с вкладками.
 * Реализует "семантическую обработку видео" из главы 2.2.
 */
export default function Summary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideoById, getSimilarVideos } = useVideos();
  const video = getVideoById(id);
  const similar = getSimilarVideos(id, 3);
  const [activeTab, setActiveTab] = useState('summary');

  if (!video) {
    return (
      <div className="summary__not-found">
        <h2>Видео не найдено</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  return (
    <div className="summary">
      <div className="summary__top">
        <Link to={`/video/${video.id}`} className="summary__preview" aria-label="Открыть видеоплеер">
          {video.status === 'ready' ? (
            <img
              src={`https://picsum.photos/seed/${video.id}/800/500`}
              alt=""
              className="summary__preview-img"
              loading="lazy"
            />
          ) : (
            <div className="summary__preview-bg" />
          )}
        </Link>

        <div className="summary__info-card">
          <nav className="summary__tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`summary__tab ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="summary__tab-content" role="tabpanel">
            {activeTab === 'summary' && (
              <>
                <p className="summary__description">{video.description}</p>
                <h3 className="summary__decisions-title">Ключевые решения:</h3>
                <ul className="summary__decisions-list">
                  <li>Зафиксировать гибридную схему хранения с локальным кешем</li>
                  <li>Использовать event bus для асинхронной синхронизации</li>
                  <li>Подготовить архитектурный документ к концу спринта</li>
                  <li>Запланировать поэтапную миграцию данных</li>
                  <li>Назначить ответственных за каждый этап</li>
                  <li>Подготовить план отката для каждого шага</li>
                  <li>Провести демо результатов на следующей неделе</li>
                </ul>
              </>
            )}
            {activeTab === 'participants' && (
              <ul className="summary__participants">
                <li>Алексей Иванов — модератор</li>
                <li>Елена Петрова — техлид</li>
                <li>Мария Сидорова — разработчик</li>
                <li>Никита Семёнов — архитектор</li>
              </ul>
            )}
            {activeTab === 'decisions' && (
              <ul className="summary__decisions-list">
                <li>Внедрить гибридное хранилище данных</li>
                <li>Запустить миграцию в три этапа</li>
                <li>Согласовать новый API с командой бэкенда</li>
              </ul>
            )}
            {activeTab === 'next' && (
              <ul className="summary__decisions-list">
                <li>Подготовить детализированный план до 30 числа</li>
                <li>Назначить встречу с командой DevOps</li>
                <li>Создать ветку в репозитории для прототипа</li>
              </ul>
            )}
          </div>

          <div className="summary__tags">
            {video.tags.map((tag) => (
              <span key={tag} className="summary__tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="summary__title-block">
        <h1 className="summary__video-title">{video.title}</h1>
        <div className="summary__meta">
          <span>{video.department}</span>
          <span aria-hidden="true">•</span>
          <span>{formatRelativeTime(video.uploadedAt)}</span>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="summary__similar">
          <h2 className="summary__similar-title">Похожие</h2>
          <div className="summary__similar-grid">
            {similar.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
