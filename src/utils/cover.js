/**
 * Генерация уникальных цветных превью для видео.
 * Цвет градиента детерминированно зависит от seed (id или названия),
 * поэтому одно и то же видео всегда получает один и тот же фон.
 */

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Возвращает CSS-строку линейного градиента под фон превью.
 * Цвета подбираются по HSL — разнообразно, но в одной насыщенности,
 * чтобы общая стилистика библиотеки оставалась цельной.
 */
export function coverBackground(seed) {
  const h = hashSeed(String(seed) || 'default');
  const hue1 = h % 360;
  const hue2 = (hue1 + 35 + ((h >> 9) % 80)) % 360;
  const angle = (h >> 3) % 360;
  return `linear-gradient(${angle}deg, hsl(${hue1}, 55%, 48%) 0%, hsl(${hue2}, 60%, 32%) 100%)`;
}

/**
 * Возвращает короткие инициалы темы — для отображения поверх градиента.
 * Берёт первую букву из первых двух значимых слов названия.
 */
export function coverInitials(title) {
  if (!title) return '◆';
  const words = title.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return title.charAt(0).toUpperCase();
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}
