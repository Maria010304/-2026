import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVideos } from '../../context/VideosContext';
import { MenuIcon, SearchIcon, ChevronDownIcon } from '../Icons/Icons';
import './Header.css';

const SEARCH_MODES = [
  { id: 'keyword', label: 'Keyword' },
  { id: 'semantic', label: 'Semantic' },
  { id: 'hybrid', label: 'Hybrid' },
];

/**
 * Шапка сайта.
 * Состав:
 *  - бургер (открывает Sidebar)
 *  - логотип (точное соответствие макету — буква B в красном квадрате)
 *  - поиск с переключателем режима (Keyword/Semantic/Hybrid) — только в variant='full'
 *  - правая зона с контекстной кнопкой и индикатором статуса
 *
 * Цвет точки-индикатора зависит от состояния системы (приоритет сверху вниз):
 *  - красный, если есть видео с ошибкой загрузки (status === 'error')
 *  - оранжевый, если есть видео в обработке (status === 'processing')
 *  - зелёный — система в норме
 */
export default function Header({ onToggleSidebar, variant = 'full' }) {
  const { isAuthenticated } = useAuth();
  const { hasProcessing, hasError } = useVideos();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [searchMode, setSearchMode] = useState('keyword');
  const [modeOpen, setModeOpen] = useState(false);

  // Определяем модификатор цвета индикатора: красный > оранжевый > зелёный
  const dotState = hasError ? 'error' : hasProcessing ? 'processing' : 'ok';
  const dotTitle = hasError
    ? 'Ошибка загрузки одного из видео'
    : hasProcessing
    ? 'Идёт обработка видео'
    : 'Система в норме';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue)}&mode=${searchMode}`);
    }
  };

  const handlePrimaryAction = () => {
    if (isAuthenticated) navigate('/upload');
    else navigate('/login');
  };

  const isOnAuth = location.pathname === '/login';
  const isOnRegister = location.pathname === '/register';

  // Правая кнопка — контекстная.
  // /login — скрываем (кнопки уже есть в форме)
  // /register — "Войти"
  // авторизован + full — "Загрузить"
  // авторизован + minimal — "На главную"
  // неавторизован — "Войти"
  const renderRightButton = () => {
    if (isOnAuth) return null;
    if (isOnRegister) {
      return (
        <button className="btn btn-outline" onClick={() => navigate('/login')}>
          Войти
        </button>
      );
    }
    if (isAuthenticated) {
      if (variant === 'full') {
        return (
          <button className="btn btn-primary" onClick={handlePrimaryAction}>
            Загрузить
          </button>
        );
      }
      return (
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          На главную
        </button>
      );
    }
    return (
      <button className="btn btn-primary" onClick={() => navigate('/login')}>
        Войти
      </button>
    );
  };

  return (
    <header className="header" role="banner">
      <div className="header__left">
        <button
          type="button"
          className="btn btn-icon"
          onClick={onToggleSidebar}
          aria-label="Открыть меню"
        >
          <MenuIcon />
        </button>
        <Link to="/" className="header__logo" aria-label="Ifbest Enterprise — на главную">
          <BrandLogo />
          <span className="header__logo-text">Enterprise</span>
        </Link>
      </div>

      {variant === 'full' && (
        <form className="header__search" onSubmit={handleSearch} role="search">
          <input
            type="search"
            className="header__search-input"
            placeholder="Поиск"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Поиск видео"
          />
          <button
            type="button"
            className="header__search-mode"
            onClick={() => setModeOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={modeOpen}
            aria-label="Режим поиска"
          >
            <SearchIcon size={16} />
            <ChevronDownIcon size={16} />
          </button>
          {modeOpen && (
            <ul className="header__search-modes" role="listbox">
              {SEARCH_MODES.map((mode) => (
                <li key={mode.id}>
                  <button
                    type="button"
                    className={`header__search-mode-item ${searchMode === mode.id ? 'is-active' : ''}`}
                    onClick={() => { setSearchMode(mode.id); setModeOpen(false); }}
                    role="option"
                    aria-selected={searchMode === mode.id}
                  >
                    {mode.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      )}

      <div className="header__right">
        {renderRightButton()}
        {isAuthenticated && (
          <div
            className="header__avatar"
            aria-label={dotTitle}
            title={dotTitle}
          >
            <span
              className={`header__avatar-dot header__avatar-dot--${dotState}`}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Логотип бренда — буква B в красном квадрате с закруглёнными углами.
 * Стилизация максимально точно повторяет фигма-макет.
 */
function BrandLogo() {
  return (
    <span className="header__logo-mark" aria-hidden="true">
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="38" rx="8" fill="#E63946"/>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
          d="M11 9h11.1c3.1 0 5.6 2.5 5.6 5.6 0 1.6-.65 3-1.7 4.02 1.55 1.1 2.55 2.9 2.55 4.95 0 3.3-2.7 6.03-6.03 6.03H11V9zm3.6 3.3v5h7c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5h-7zm0 8v6.4h7.6c1.75 0 3.2-1.45 3.2-3.2 0-1.75-1.45-3.2-3.2-3.2h-7.6z"
        />
      </svg>
    </span>
  );
}
