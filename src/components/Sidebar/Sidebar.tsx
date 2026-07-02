import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  iconeDashboard,
  iconeAssinaturas,
  iconeConfig,
  iconeSair
} from '../../assets';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <h2 className="user-name">Usuário</h2>
        <span className="user-role">Administrador</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <img src={iconeDashboard} alt="Dashboard" className='nav-icon' />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/subscriptions"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <img src={iconeAssinaturas} alt="Assinaturas" className='nav-icon'/>
          <span>Assinaturas</span>
        </NavLink>


      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <img src={iconeConfig} alt="Configurações" className="nav-icon" />
          <span>Configurações</span>
        </button>

        <button className="nav-item btn-sair">
          <img src={iconeSair} alt="Sair" className="nav-icon" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
