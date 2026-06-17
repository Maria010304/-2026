/**
 * Утилиты форматирования данных для отображения в UI.
 */

/**
 * Форматирует длительность в секундах в строку "X минут Y секунд".
 */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} секунд${pluralEnding(s, '', 'у', 'ы')}`;
  return `${m} минут${pluralEnding(m, '', 'у', 'ы')} ${s} секунд${pluralEnding(s, '', 'у', 'ы')}`;
}

/**
 * Форматирует время в плеере: MM:SS.
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Возвращает относительное время: "5 минут назад", "1 день назад" и т.д.
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} минут${pluralEnding(diffMin, 'у', 'ы', '')} назад`;
  if (diffHr < 24) return `${diffHr} час${pluralEnding(diffHr, '', 'а', 'ов')} назад`;
  if (diffDay < 30) return `${diffDay} ${pluralEnding(diffDay, 'день', 'дня', 'дней')} назад`;

  const months = Math.floor(diffDay / 30);
  return `${months} ${pluralEnding(months, 'месяц', 'месяца', 'месяцев')} назад`;
}

/**
 * Возвращает окончание для русского склонения по числу.
 * (1 минута, 2 минуты, 5 минут)
 */
function pluralEnding(n, one, two, five) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return five;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return two;
  return five;
}

/**
 * Форматирует большое число: 1247 -> "1 247".
 */
export function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}
