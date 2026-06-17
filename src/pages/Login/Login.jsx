import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import Header from '../../components/Header/Header';
import { USERS } from '../../data/users';
import './Login.css';

/**
 * Страница авторизации (макет "Авторизация L black").
 * Модалка поверх размытой имитации главной страницы.
 *
 * В шапке для /login правая кнопка скрыта (логика в Header.jsx),
 * чтобы не дублировать кнопки "Регистрация" / "Войти", которые уже есть в форме.
 */
export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Заполните email и пароль');
      return;
    }
    if (!agreed) {
      setError('Необходимо согласиться с обработкой данных');
      return;
    }
    if (!captcha) {
      setError('Подтвердите, что вы не робот');
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      showToast(`Добро пожаловать, ${user.name}!`, 'success');
      const target = location.state?.from || '/';
      navigate(target);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Быстрое заполнение для апробации трёх ролей
  const quickFill = (role) => {
    const user = USERS.find((u) => u.role === role);
    setForm({ username: user.name, email: user.email, password: user.password });
    setAgreed(true);
    setCaptcha(true);
  };

  return (
    <div className="login-page">
      <Header variant="full" />
      <div className="login-page__backdrop" aria-hidden="true">
        <div className="login-page__blur-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="login-page__blur-card" />
          ))}
        </div>
      </div>

      <div className="login-page__modal-wrapper">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-card__title">Авторизация</h1>

          <input
            type="text"
            className="auth-card__input"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
            aria-label="Имя пользователя"
          />
          <input
            type="email"
            className="auth-card__input"
            placeholder="Электронная почта"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            aria-label="Email"
          />
          <input
            type="password"
            className="auth-card__input"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            aria-label="Пароль"
          />

          <label className="auth-card__checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              Согласен на обработку <a href="#">персональных данных</a>
              {' '}и с <a href="#">пользовательским соглашением</a>
            </span>
          </label>

          <div className="auth-card__captcha">
            <label className="auth-card__captcha-inner">
              <input
                type="checkbox"
                checked={captcha}
                onChange={(e) => setCaptcha(e.target.checked)}
              />
              <span>Я не робот</span>
              <span className="auth-card__captcha-logo" aria-hidden="true">reCAPTCHA</span>
            </label>
          </div>

          {error && <div className="auth-card__error" role="alert">{error}</div>}

          <div className="auth-card__actions">
            <Link to="/register" className="btn btn-secondary">Регистрация</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>

          <a href="#" className="auth-card__forgot">Забыли пароль?</a>

          {/* Быстрый вход — компактная одна строка для апробации */}
          <div className="auth-card__quick">
            <span>Демо:</span>
            <button type="button" onClick={() => quickFill('director')}>директор</button>
            <button type="button" onClick={() => quickFill('manager')}>руководитель</button>
            <button type="button" onClick={() => quickFill('employee')}>сотрудник</button>
          </div>
        </form>
      </div>
    </div>
  );
}
