import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

/**
 * Базовая раскладка приложения для большинства страниц.
 * Используется как родительский маршрут.
 */
export default function Layout({ headerVariant = 'full' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        variant={headerVariant}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="layout__main fade-in">
        <Outlet />
      </main>
    </div>
  );
}
