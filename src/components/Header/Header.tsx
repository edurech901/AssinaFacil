import {
  iconeNotificacao,
  iconeAjuda,
  logo,
} from '../../assets';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={logo} alt="Assina Fácil" />
      </div>

      <div className="header-actions">
        <a type="button" className="icon-button" aria-label="Notificações">
          <img src={iconeNotificacao} alt="Notificações" />
        </a>

        <a type="button" className="icon-button" aria-label="Ajuda" href="/ajuda">
          <img src={iconeAjuda} alt="Ajuda" />
        </a>
        <a href="/perfil"><div className="avatar">A</div></a>
        
      </div>
    </header>
  );
}
