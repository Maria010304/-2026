/**
 * Генератор карты решений.
 *
 * Структура карты теперь зависит от количества выбранных видео:
 *  - 1 видео   → корень + 1–2 темы (2–3 узла, простое дерево)
 *  - 2 видео   → + 1 действие (4 узла)
 *  - 3 видео   → 3 темы + 1 действие (5 узлов)
 *  - 4 видео   → + ещё одно действие (6 узлов)
 *  - 5 видео   → + третье действие, шире сетка (7 узлов)
 *  - 6+ видео  → + итоговый узел внизу (8 узлов)
 *
 * Конкретные узлы выбираются из пулов псевдо-случайно, но детерминированно:
 * сид формируется из id выбранных видео. Это значит, что для одной и той же
 * комбинации видео карта всегда одна и та же — это важно для апробации,
 * чтобы можно было повторить демонстрацию.
 */

const ROOT_POOL = [
  { label: 'Стратегическая инициатива по платформе', marker: 'red' },
  { label: 'Развитие корпоративной экосистемы', marker: 'red' },
  { label: 'Модернизация продукта в Q3', marker: 'red' },
  { label: 'План трансформации отдела', marker: 'red' },
  { label: 'Стратегия выхода на новый сегмент', marker: 'red' },
];

const THEME_POOL = [
  { label: 'Техническая модернизация архитектуры', marker: 'blue' },
  { label: 'UX-улучшения интерфейса', marker: 'green' },
  { label: 'Оптимизация процессов команды', marker: 'yellow' },
  { label: 'Аналитика пользовательского поведения', marker: 'blue' },
  { label: 'Развитие практик тестирования', marker: 'green' },
  { label: 'Снижение технического долга', marker: 'yellow' },
  { label: 'Усиление коммуникаций между отделами', marker: 'red' },
  { label: 'Внедрение новых инструментов разработки', marker: 'blue' },
];

const ACTION_POOL = [
  { label: 'Миграция на новый технологический стек', marker: 'green' },
  { label: 'Внедрение единой дизайн-системы', marker: 'blue' },
  { label: 'Поэтапный выкат изменений в продакшен', marker: 'red' },
  { label: 'Автоматизация процессов деплоя', marker: 'yellow' },
  { label: 'Введение регулярных код-ревью', marker: 'green' },
  { label: 'Стандартизация технической документации', marker: 'blue' },
  { label: 'Обновление онбординга для новых сотрудников', marker: 'yellow' },
  { label: 'Запуск пилота на одном из отделов', marker: 'red' },
  { label: 'Пересмотр KPI для команд', marker: 'green' },
];

const SUMMARY_POOL = [
  { label: 'Финальный отчёт по итогам квартала', marker: 'red' },
  { label: 'Демо результатов для всей компании', marker: 'blue' },
  { label: 'Защита плана перед руководством', marker: 'yellow' },
];

/**
 * Детерминированный псевдо-генератор случайных чисел с сидом.
 * Линейный конгруэнтный метод — достаточно для выбора из пула.
 */
function makeRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Превращает строки (id выбранных видео) в число для использования сидом.
 */
function hashStrings(strings) {
  const joined = strings.join('|');
  let hash = 0;
  for (let i = 0; i < joined.length; i++) {
    hash = ((hash << 5) - hash + joined.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

/**
 * Выбирает n элементов из массива псевдо-случайно, без повторов.
 */
function pickN(arr, n, rand) {
  const copy = [...arr];
  const result = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/**
 * Главная функция. Возвращает массив узлов с полями id, label, marker, level, parents.
 * Формат совместим с компонентом DecisionMap, который рендерит SVG-связи.
 */
export function generateDecisionMap(selectedVideoIds) {
  if (!selectedVideoIds || selectedVideoIds.length === 0) return [];

  const count = selectedVideoIds.length;
  const rand = makeRandom(hashStrings(selectedVideoIds));

  // 1) Корневой узел
  const root = {
    id: 'n-root',
    ...pickN(ROOT_POOL, 1, rand)[0],
    level: 0,
    parents: [],
  };

  // 2) Сколько тем на 2-м уровне (зависит от количества видео)
  const themeCount = count === 1 ? 1
                   : count === 2 ? 2
                   : count <= 4 ? 3
                   : 3; // больше 3 тем в ряд не помещается красиво

  const themes = pickN(THEME_POOL, themeCount, rand).map((node, idx) => ({
    id: `n-theme-${idx}`,
    ...node,
    level: 1,
    parents: ['n-root'],
  }));

  // 3) Действия на 3-м уровне — появляются с двух видео и больше
  const actionCount = count <= 1 ? 0
                    : count === 2 ? 1
                    : count === 3 ? 1
                    : count === 4 ? 2
                    : 3;

  const actions = pickN(ACTION_POOL, actionCount, rand).map((node, idx) => {
    // Каждое действие связано с 1–2 темами (зависит от idx и количества тем)
    const parentThemes = themes.length === 1
      ? [themes[0].id]
      : idx === 0
        ? [themes[0].id, themes[Math.min(1, themes.length - 1)].id]
        : idx === 1
          ? [themes[Math.min(1, themes.length - 1)].id, themes[themes.length - 1].id]
          : [themes[themes.length - 1].id];
    return {
      id: `n-action-${idx}`,
      ...node,
      level: 2,
      parents: parentThemes,
    };
  });

  // 4) Итоговый узел на 4-м уровне — только для крупных карт
  const summary = count >= 6
    ? [{
        id: 'n-summary',
        ...pickN(SUMMARY_POOL, 1, rand)[0],
        level: 3,
        // связан со всеми действиями
        parents: actions.map((a) => a.id),
      }]
    : [];

  return [root, ...themes, ...actions, ...summary];
}
