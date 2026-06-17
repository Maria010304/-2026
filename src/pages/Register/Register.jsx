import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast';
import Header from '../../components/Header/Header';
import { ALL_DEPARTMENTS } from '../../data/videos';
import './Register.css';

/**
 * Страница регистрации.
 * Отдельная страница (не модалка) — соответствует макету "Регистрация L black".
 */
export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    username: '',
    department: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('Заполните обязательные поля');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (!agreed || !captcha) {
      setError('Необходимо принять условия и подтвердить, что вы не робот');
      return;
    }

    // В демо-прототипе регистрация не создаёт нового пользователя на бэке —
    // просто показывает успех и редиректит на /login.
    showToast('Регистрация успешна. Войдите в систему.', 'success');
    setTimeout(() => navigate('/login'), 800);
  };

  return (
    <div className="register-page">
      <Header variant="minimal" />
      <div className="register-page__container">
        <form className="register-card" onSubmit={handleSubmit} noValidate>
          <h1 className="register-card__title">Регистрация</h1>

          <input
            type="text"
            className="register-card__input"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <select
            className="register-card__input register-card__select"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            aria-label="Отдел"
          >
            <option value="">Отдел</option>
            {ALL_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="email"
            className="register-card__input"
            placeholder="Электронная почта"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="register-card__input"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            className="register-card__input"
            placeholder="Подтверждение пароля"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />

          <label className="register-card__checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              Согласен на обработку <a href="#">персональных данных</a><br />
              и с <a href="#">пользовательским соглашением</a>
            </span>
          </label>

          <div className="register-card__captcha">
            <label className="register-card__captcha-inner">
              <input
                type="checkbox"
                checked={captcha}
                onChange={(e) => setCaptcha(e.target.checked)}
              />
              <span>Я не робот</span>
              <span className="register-card__captcha-logo">reCAPTCHA</span>
            </label>
          </div>

          {error && <div className="register-card__error" role="alert">{error}</div>}

          <button type="submit" className="btn btn-primary register-card__submit">
            Регистрация
          </button>
        </form>
      </div>
    </div>
  );
}
