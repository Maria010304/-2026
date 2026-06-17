/**
 * Тестовые пользователи для демонстрации трёх ролей.
 * Логин/пароль работает в форме авторизации.
 */

export const USERS = [
  {
    id: 'u-director',
    name: 'Алексей Иванов',
    email: 'director@ifbest.ru',
    password: 'password',
    role: 'director',
    roleLabel: 'Директор',
    department: 'Управление',
    avatar: null,
  },
  {
    id: 'u-manager',
    name: 'Елена Петрова',
    email: 'manager@ifbest.ru',
    password: 'password',
    role: 'manager',
    roleLabel: 'Руководитель отдела',
    department: 'Отдел разработки',
    avatar: null,
  },
  {
    id: 'u-employee',
    name: 'Мария Сидорова',
    email: 'employee@ifbest.ru',
    password: 'password',
    role: 'employee',
    roleLabel: 'Сотрудник',
    department: 'ИТ-отдел',
    avatar: null,
  },
];

/**
 * Возвращает разрешения для роли.
 * Реализация ролевой модели из таблицы в главе 2.1 диплома.
 */
export function getPermissions(role) {
  switch (role) {
    case 'director':
      return {
        viewAllVideos: true,
        viewAnalytics: true,
        viewDecisionMap: true,
        viewVCS: true,
        uploadVideo: true,
        deleteAnyVideo: true,
        scope: 'all',
      };
    case 'manager':
      return {
        viewAllVideos: false,
        viewAnalytics: true,
        viewDecisionMap: true,
        viewVCS: false,
        uploadVideo: true,
        deleteAnyVideo: false,
        scope: 'department',
      };
    case 'employee':
    default:
      return {
        viewAllVideos: false,
        viewAnalytics: false,
        viewDecisionMap: false,
        viewVCS: false,
        uploadVideo: true,
        deleteAnyVideo: false,
        scope: 'own-and-public',
      };
  }
}
