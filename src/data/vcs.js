/**
 * Мок-данные страницы управления VCS-интеграциями
 * (доступно только директору, макет "Управление VCS L black").
 */

export const VCS_INTEGRATIONS = [
  {
    id: 'i-1',
    provider: 'GitHub',
    url: 'github.com/mycompany',
    status: 'active',
    statusLabel: 'Active',
    lastSync: 'Синхр: 2 часа назад',
  },
  {
    id: 'i-2',
    provider: 'GitLab',
    url: 'gitlab.company.com',
    status: 'error',
    statusLabel: 'Error',
    lastSync: 'Синхр: ошибка',
  },
  {
    id: 'i-3',
    provider: 'GitLab',
    url: 'gitlab.company.com',
    status: 'pending',
    statusLabel: 'Pending',
    lastSync: 'Синхр: никогда',
  },
];

export const WEBHOOK_LOGS = [
  { id: 'w-1', time: '14:23', type: 'push', branch: 'main', message: 'Fix login bug', status: 'processed', integration: 'GitHub (github.com/mycompany)' },
  { id: 'w-2', time: '14:18', type: 'push', branch: 'main', message: 'Update README', status: 'processed', integration: 'GitHub (github.com/mycompany)' },
  { id: 'w-3', time: '13:55', type: 'pull_request', branch: 'feature/api', message: 'Add new endpoint', status: 'processed', integration: 'GitHub (github.com/mycompany)' },
  { id: 'w-4', time: '13:42', type: 'push', branch: 'develop', message: 'Refactor auth module', status: 'failed', integration: 'GitLab (gitlab.company.com)' },
  { id: 'w-5', time: '12:30', type: 'push', branch: 'main', message: 'Fix CSS issues', status: 'processed', integration: 'GitHub (github.com/mycompany)' },
];

export const QUICK_ACTIONS = [
  { id: 'sync-all', label: 'Синхронизировать все', sublabel: '(за последние 24 часа)', icon: 'check-list' },
  { id: 'retry-failed', label: 'Повторить упавшие webhook', sublabel: '(последние 50)', icon: 'refresh' },
  { id: 'verify', label: 'Проверить состояние интеграций', sublabel: '', icon: 'check-circle' },
  { id: 'export', label: 'Экспортировать историю webhook', sublabel: '', icon: 'thumbs-up' },
  { id: 'cleanup', label: 'Очистить старые логи', sublabel: '(>30 дней)', icon: 'trash' },
];
