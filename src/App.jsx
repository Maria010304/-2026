import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { VideosProvider } from './context/VideosContext';
import { ToastProvider } from './components/Toast/Toast';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import Summary from './pages/Summary/Summary';
import DecisionMap from './pages/DecisionMap/DecisionMap';
import Upload from './pages/Upload/Upload';
import Analytics from './pages/Analytics/Analytics';
import VCS from './pages/VCS/VCS';

/**
 * Корневой компонент.
 * Иерархия провайдеров: Theme → Auth → Toast → Routes.
 *
 * Структура маршрутов:
 *  /login, /register — отдельная вёрстка (без Layout)
 *  /, /video/:id, /summary/:id, /upload — общий Layout, доступно авторизованным
 *  /analytics, /decision-map — Layout + проверка роли
 *  /vcs — Layout + только для директора
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VideosProvider>
          <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Защищённые маршруты с обычной шапкой */}
            <Route element={<ProtectedRoute><Layout headerVariant="full" /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Защищённые маршруты с упрощённой шапкой (без поиска) */}
            <Route element={<ProtectedRoute><Layout headerVariant="minimal" /></ProtectedRoute>}>
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/summary/:id" element={<Summary />} />
              <Route path="/upload" element={<Upload />} />
            </Route>

            {/* Аналитика — для директора и руководителя */}
            <Route
              element={
                <ProtectedRoute requirePermission="viewAnalytics">
                  <Layout headerVariant="minimal" />
                </ProtectedRoute>
              }
            >
              <Route path="/analytics" element={<Analytics />} />
            </Route>

            {/* Карта решений — для директора и руководителя */}
            <Route
              element={
                <ProtectedRoute requirePermission="viewDecisionMap">
                  <Layout headerVariant="minimal" />
                </ProtectedRoute>
              }
            >
              <Route path="/decision-map" element={<DecisionMap />} />
            </Route>

            {/* VCS — только для директора */}
            <Route
              element={
                <ProtectedRoute requirePermission="viewVCS">
                  <Layout headerVariant="minimal" />
                </ProtectedRoute>
              }
            >
              <Route path="/vcs" element={<VCS />} />
            </Route>

            {/* Заглушка 404 — на главную */}
            <Route path="*" element={<Home />} />
          </Routes>
          </ToastProvider>
        </VideosProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
