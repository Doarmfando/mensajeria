import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header() {
  const { username, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <h1 className="header__title">Sistema de Mensajeria</h1>
          <p className="header__subtitle">WhatsApp Business</p>
        </div>
        <nav className="header__nav">
          <NavLink to="/" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
            Enviar mensajes
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}>
            Templates
          </NavLink>
          <button className="header__logout" onClick={logout}>
            {username} - Salir
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
