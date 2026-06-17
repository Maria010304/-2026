import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Защищённый маршрут. Если пользователь не авторизован — редирект на /login.
 * Если задан requirePermission — проверяет, что у роли есть это право.
 * При отсутствии прав — редирект на главную (вместо 403, чтобы не пугать).
 */
export default function ProtectedRoute({ children, requirePermission }) {
  const { isAuthenticated, permissions } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requirePermission && !permissions?.[requirePermission]) {
    return <Navigate to="/" replace />;
  }

  return children;
}
