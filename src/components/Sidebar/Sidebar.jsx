import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  HomeIcon, MapIcon, GitBranchIcon, ChartIcon, SunIcon, MoonIcon, CloseIcon
} from '../Icons/Icons';
import './Sidebar.css';

/**
 * Выдвижное боковое меню.
 * Состав пунктов зависит от роли (RBAC из главы 2.1).
 * Переключатель темы — обычный пункт меню в общем списке навигации
 * (по макету "Меню", где он стоит рядом с другими разделами).
 */
export default function Sidebar({ isOpen, onClose }) {
  const { permissions, isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Главная', icon: <HomeIcon size={20} />, show: true },
    { to: '/decision-map', label: 'Карта решений', icon: <MapIcon size={20} />, show: permissions?.viewDecisionMap },
    { to: '/vcs', label: 'Управление VCS интеграциями', icon: <GitBranchIcon size={20} />, show: permissions?.viewVCS },
    { to: '/analytics', label: 'Аналитика', icon: <ChartIcon size={20} />, show: permissions?.viewAnalytics },
  ].filter((item) => item.show);

  return (
    <>
      {isOpen && (
        <div className="sidebar__overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Главное меню"
      >
        <div className="sidebar__header">
          <span className="sidebar__logo">
            <svg width="32" height="32" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="8" fill="#E63946"/>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="white"
                d="M11 9h11.1c3.1 0 5.6 2.5 5.6 5.6 0 1.6-.65 3-1.7 4.02 1.55 1.1 2.55 2.9 2.55 4.95 0 3.3-2.7 6.03-6.03 6.03H11V9zm3.6 3.3v5h7c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5h-7zm0 8v6.4h7.6c1.75 0 3.2-1.45 3.2-3.2 0-1.75-1.45-3.2-3.2-3.2h-7.6z"
              />
            </svg>
            <span>Enterprise</span>
          </span>
          <button
            type="button"
            className="btn btn-icon sidebar__close"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <CloseIcon />
          </button>
        </div>

        {isAuthenticated && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar" aria-hidden="true">
              {user.name.charAt(0)}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user.name}</div>
              <div className="sidebar__user-role">{user.roleLabel}</div>
            </div>
          </div>
        )}

        <nav className="sidebar__nav" aria-label="Разделы">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar__nav-link ${isActive ? 'is-active' : ''}`
                  }
                  onClick={onClose}
                  end={item.to === '/'}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            {/* Переключатель темы — обычный пункт меню, по макету "Меню" */}
            <li>
              <button type="button" className="sidebar__nav-link" onClick={toggleTheme}>
                {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
                <span>Тема | {theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
              </button>
            </li>
          </ul>
        </nav>

        {isAuthenticated && (
          <div className="sidebar__footer">
            <button type="button" className="sidebar__logout" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
