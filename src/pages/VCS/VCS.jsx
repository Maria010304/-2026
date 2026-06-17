import { useState } from 'react';
import { VCS_INTEGRATIONS, WEBHOOK_LOGS, QUICK_ACTIONS } from '../../data/vcs';
import { useToast } from '../../components/Toast/Toast';
import { RefreshIcon, ListIcon, CheckCircleIcon, ThumbsUpIcon, TrashIcon } from '../../components/Icons/Icons';
import './VCS.css';

/**
 * Страница управления VCS-интеграциями (доступно только директору).
 * Точно по макету "Управление VCS L black":
 *  - список интеграций (левая колонка вверху)
 *  - форма создания (правая колонка вверху)
 *  - история webhook (левая колонка внизу)
 *  - быстрые действия (правая колонка внизу)
 */
export default function VCS() {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState(VCS_INTEGRATIONS);
  const [form, setForm] = useState({ name: '', url: '', token: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('24h');

  const handleCreate = () => {
    if (!form.name || !form.url) {
      showToast('Заполните название и URL', 'error');
      return;
    }
    setIntegrations((prev) => [
      ...prev,
      {
        id: `i-${Date.now()}`,
        provider: form.name,
        url: form.url,
        status: 'pending',
        statusLabel: 'Pending',
        lastSync: 'Синхр: никогда',
      },
    ]);
    setForm({ name: '', url: '', token: '' });
    showToast('Интеграция создана', 'success');
  };

  const handleAction = (action, integration) => {
    switch (action) {
      case 'check':
        showToast(`Проверка ${integration.provider}: соединение установлено`, 'success');
        break;
      case 'sync':
        showToast(`Синхронизация ${integration.provider} запущена`, 'info');
        break;
      case 'delete':
        setIntegrations((prev) => prev.filter((i) => i.id !== integration.id));
        showToast('Интеграция удалена', 'warning');
        break;
      default:
        showToast(`Действие "${action}" недоступно в демо`, 'info');
    }
  };

  const handleQuickAction = (id) => {
    const action = QUICK_ACTIONS.find((a) => a.id === id);
    showToast(`Выполнено: ${action?.label}`, 'success');
  };

  const filteredLogs = WEBHOOK_LOGS.filter((log) => {
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="vcs">
      <h1 className="vcs__title">Управление VCS интеграциями</h1>

      <div className="vcs__grid">
        {/* Список интеграций */}
        <section className="vcs__block surface">
          <header className="vcs__block-header">
            <span>Список интеграций</span>
            <button
              className="vcs__refresh"
              onClick={() => showToast('Список обновлён', 'info')}
            >
              Обновить
            </button>
          </header>
          <div className="vcs__integrations">
            {integrations.map((integration) => (
              <IntegrationItem
                key={integration.id}
                integration={integration}
                onAction={handleAction}
              />
            ))}
            {integrations.length === 0 && (
              <p className="vcs__empty">Нет настроенных интеграций</p>
            )}
          </div>
        </section>

        {/* Форма создания новой интеграции */}
        <section className="vcs__block surface">
          <header className="vcs__block-header">
            <span>Создать новую интеграцию</span>
          </header>

          <div className="vcs__form">
            <div className="vcs__provider">
              <div className="vcs__provider-title">Провайдер:</div>
              <div className="vcs__provider-name">Название провайдера</div>
              <ul className="vcs__provider-list">
                <li>GitHub</li>
                <li>GitLab</li>
                <li>Bitbucket</li>
                <li>Azure DevOps</li>
              </ul>
            </div>

            <input
              type="text"
              className="vcs__input"
              placeholder="Название:"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              className="vcs__input"
              placeholder="URL:"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
            <input
              type="password"
              className="vcs__input"
              placeholder="Access token:"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
            />

            <div className="vcs__form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => showToast('Подключение проверено', 'success')}
              >
                Проверить подключение
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setForm({ name: '', url: '', token: '' })}
              >
                Отмена
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Создать
              </button>
            </div>
          </div>
        </section>

        {/* История webhook логов */}
        <section className="vcs__block surface">
          <header className="vcs__block-header">
            <span>История webhook логов</span>
          </header>
          <div className="vcs__log-filters">
            <span className="vcs__log-filter-label">Фильтр:</span>
            <select
              className="vcs__log-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Статус"
            >
              <option value="all">Все статусы</option>
              <option value="processed">Обработан</option>
              <option value="failed">Ошибка</option>
            </select>
            <select
              className="vcs__log-filter"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              aria-label="Период"
            >
              <option value="24h">Последние 24 часа</option>
              <option value="7d">Последние 7 дней</option>
              <option value="30d">Последние 30 дней</option>
            </select>
            <button
              className="vcs__refresh-icon"
              onClick={() => showToast('Логи обновлены', 'info')}
              aria-label="Обновить логи"
            >
              <RefreshIcon size={18} />
            </button>
          </div>
          <div className="vcs__logs">
            {filteredLogs.map((log) => (
              <article key={log.id} className="vcs__log">
                <div className="vcs__log-top">
                  <span className={`vcs__log-dot vcs__log-dot--${log.status === 'failed' ? 'error' : 'success'}`} />
                  <span className="vcs__log-time">{log.time}</span>
                  <span className="vcs__log-chip">{log.type}</span>
                  <span className="vcs__log-chip">{log.branch}</span>
                  <span className="vcs__log-chip">{log.message}</span>
                  <span className={`vcs__log-status ${log.status === 'failed' ? 'is-failed' : ''}`}>
                    {log.status === 'failed' ? 'ошибка' : 'обработан'}
                  </span>
                </div>
                <div className="vcs__log-source">Интеграция: {log.integration}</div>
              </article>
            ))}
            {filteredLogs.length === 0 && (
              <p className="vcs__empty">Нет логов за выбранный период</p>
            )}
          </div>
        </section>

        {/* Быстрые действия */}
        <section className="vcs__block surface">
          <header className="vcs__block-header">
            <span>Быстрые действия</span>
          </header>
          <ul className="vcs__quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <li key={action.id}>
                <button className="vcs__quick-action" onClick={() => handleQuickAction(action.id)}>
                  <span className="vcs__quick-action-icon">{getActionIcon(action.icon)}</span>
                  <span className="vcs__quick-action-text">
                    <span>{action.label}</span>
                    {action.sublabel && (
                      <span className="vcs__quick-action-sub">{action.sublabel}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function IntegrationItem({ integration, onAction }) {
  return (
    <article className={`integration integration--${integration.status}`}>
      <header className="integration__header">
        <span className={`integration__dot integration__dot--${integration.status}`} />
        <span className="integration__name">{integration.provider}</span>
        <span className="integration__url">{integration.url}</span>
        <span className={`integration__status integration__status--${integration.status}`}>
          {integration.statusLabel}
        </span>
        <span className="integration__sync">{integration.lastSync}</span>
      </header>
      <div className="integration__actions">
        <button onClick={() => onAction('check', integration)}>Проверить</button>
        <button onClick={() => onAction('sync', integration)}>Синхронизировать</button>
        <button onClick={() => onAction('configure', integration)}>Настроить</button>
        <button onClick={() => onAction('delete', integration)} className="integration__action-danger">
          Удалить
        </button>
      </div>
    </article>
  );
}

function getActionIcon(name) {
  switch (name) {
    case 'check-list': return <ListIcon size={20} />;
    case 'refresh': return <RefreshIcon size={20} />;
    case 'check-circle': return <CheckCircleIcon size={20} />;
    case 'thumbs-up': return <ThumbsUpIcon size={20} />;
    case 'trash': return <TrashIcon size={20} />;
    default: return null;
  }
}
