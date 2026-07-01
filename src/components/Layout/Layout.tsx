import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-page">
        <Header />
        <main className="app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
