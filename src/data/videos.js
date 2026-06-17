/**
 * Мок-данные библиотеки видео.
 * 24 видео с разными отделами, тегами, статусами для демонстрации фильтров и пагинации.
 */

const DEPARTMENTS = [
  'ИТ-отдел',
  'Отдел маркетинга',
  'Отдел разработки',
  'Отдел продаж',
  'Отдел аналитики',
  'HR отдел',
];

const TAGS_POOL = [
  'архитектура', 'код-ревью', 'планирование', 'ретроспектива',
  'дизайн', 'обучение', 'презентация', 'демо',
  'продукт', 'аналитика', 'найм', 'онбординг',
];

const TITLES = [
  'Архитектурное ревью нового модуля биллинга',
  'Демонстрация прототипа корпоративной видеоплатформы',
  'Планирование спринта Q2 — приоритизация задач',
  'Ретроспектива релиза: что сработало, а что нет',
  'Обучение по работе с системой контроля версий',
  'Презентация результатов исследования аудитории',
  'Код-ревью: миграция на TypeScript',
  'Стратегическая сессия по развитию продукта',
  'Воркшоп по дизайн-системе для разработчиков',
  'Интервью с кандидатом на роль Senior Frontend',
  'Анализ метрик роста пользовательской базы',
  'Демонстрация работы новой системы аналитики',
  'Обсуждение бюджета на следующий квартал',
  'Онбординг новых сотрудников: первая неделя',
  'Презентация UX-исследования B2B-сегмента',
  'Технический разбор инцидента 14 марта',
  'Совещание по обновлению инфраструктуры',
  'Демонстрация интеграции с внешними системами',
  'Встреча по обсуждению маркетинговой кампании',
  'Воркшоп по проведению глубинных интервью',
  'Обсуждение roadmap на ближайшие 6 месяцев',
  'Презентация результатов A/B-тестирования',
  'Технический митап: новые подходы в React',
  'Финальная защита квартального отчёта',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTags() {
  const count = 2 + Math.floor(Math.random() * 3);
  const shuffled = [...TAGS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(maxDaysAgo) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * maxDaysAgo) * 86400000
                 + Math.floor(Math.random() * 86400000);
  return new Date(now - offset).toISOString();
}

// Заранее предопределённый Seeded-датасет, чтобы каждый раз был одинаковый порядок при перезагрузке
export const VIDEOS = TITLES.map((title, idx) => ({
  id: `v-${String(idx + 1).padStart(3, '0')}`,
  title,
  department: DEPARTMENTS[idx % DEPARTMENTS.length],
  duration: 600 + (idx * 137) % 4200, // от 10 до ~80 минут
  uploadedAt: randomDate(45),
  // Статусы: большинство ready, некоторые processing, одно с ошибкой загрузки
  // для демонстрации красного индикатора в шапке.
  status: idx === 7 ? 'error' : (idx % 11 === 0 ? 'processing' : 'ready'),
  views: 10 + (idx * 17) % 480,
  tags: randomTags(),
  uploader: idx % 3 === 0 ? 'u-director' : idx % 3 === 1 ? 'u-manager' : 'u-employee',
  visibility: idx % 5 === 0 ? 'private' : 'public',
  description:
    'Очень интересное и длинное описание того, что там происходило на конференции, ' +
    'можно даже еще чуть подлиннее, но не сильно, а может сильно, а может нет неизвестно.',
}));

/**
 * Список отделов для фильтра.
 */
export const ALL_DEPARTMENTS = DEPARTMENTS;

/**
 * Тэги для фильтра / отображения.
 */
export const ALL_TAGS = TAGS_POOL;

/**
 * Получить видео по id.
 */
export function getVideoById(id) {
  return VIDEOS.find((v) => v.id === id);
}

/**
 * Получить похожие видео (без текущего).
 */
export function getSimilarVideos(id, limit = 3) {
  const video = getVideoById(id);
  if (!video) return [];
  return VIDEOS
    .filter((v) => v.id !== id && v.department === video.department)
    .slice(0, limit);
}
