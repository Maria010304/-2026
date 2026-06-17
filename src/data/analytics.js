/**
 * Мок-данные для страницы аналитики (макет "менеджер L black").
 * KPI-карточки, графики загрузок и активности, активность отделов.
 */

export const KPI_METRICS = [
  { id: 'videos', label: 'Всего видео', value: 1247, change: '+13% за месяц' },
  { id: 'users', label: 'Всего пользователей', value: 134, change: '+9% за месяц' },
  { id: 'hours', label: 'Часов записи', value: 456, change: '+16% за месяц' },
  { id: 'departments', label: 'Отделы с видео', value: 7, change: 'из 14 (50%)' },
];

// График загрузок по дням
export const UPLOADS_CHART = [
  { date: '06.08', value: 12 },
  { date: '07.08', value: 18 },
  { date: '08.08', value: 35 },
  { date: '09.08', value: 78 },
  { date: '10.08', value: 110 },
  { date: '11.08', value: 145 },
  { date: '12.08', value: 165 },
  { date: '13.08', value: 110 },
  { date: '14.08', value: 195 },
  { date: '15.08', value: 220 },
  { date: '16.08', value: 175 },
  { date: '17.08', value: 142 },
  { date: '18.08', value: 158 },
  { date: '19.08', value: 130 },
  { date: '20.08', value: 195 },
  { date: '21.08', value: 168 },
  { date: '22.08', value: 145 },
  { date: '23.08', value: 95 },
  { date: '24.08', value: 65 },
  { date: '25.08', value: 32 },
  { date: '26.08', value: 28 },
  { date: '27.08', value: 22 },
];

// График активности пользователей по дням
export const USERS_ACTIVITY_CHART = [
  { date: '06.08', value: 20 },
  { date: '07.08', value: 25 },
  { date: '08.08', value: 45 },
  { date: '09.08', value: 92 },
  { date: '10.08', value: 120 },
  { date: '11.08', value: 150 },
  { date: '12.08', value: 175 },
  { date: '13.08', value: 125 },
  { date: '14.08', value: 200 },
  { date: '15.08', value: 215 },
  { date: '16.08', value: 180 },
  { date: '17.08', value: 152 },
  { date: '18.08', value: 168 },
  { date: '19.08', value: 140 },
  { date: '20.08', value: 205 },
  { date: '21.08', value: 175 },
  { date: '22.08', value: 155 },
  { date: '23.08', value: 105 },
  { date: '24.08', value: 75 },
  { date: '25.08', value: 40 },
  { date: '26.08', value: 30 },
  { date: '27.08', value: 25 },
];

// Активность отделов (горизонтальная диаграмма)
export const DEPARTMENTS_ACTIVITY = [
  { name: 'Отдел маркетинга', count: 234 },
  { name: 'Отдел разработки', count: 191 },
  { name: 'Отдел продаж', count: 169 },
  { name: 'Отдел аналитики', count: 134 },
  { name: 'HR отдел', count: 111 },
];
