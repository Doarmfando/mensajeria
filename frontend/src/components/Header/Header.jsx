import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';



function Header() {
  const { username, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo-wrap">
            <img src="/logo_icon_blanco.png" alt="Fortex" className="header__logo" />
          </div>

          <div className="header__brand-text">
            <h1 className="header__title">FORTEX</h1>
            <p className="header__subtitle">WhatsApp Business</p>
          </div>
        </div>

        <div className="header__right">
          <nav className="header__nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              Enviar mensajes
            </NavLink>

            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              Templates
            </NavLink>
          </nav>

          <div className="header__account">
            <div className="header__user">
              <span className="header__user-label">Sesión activa</span>
              <span className="header__username">{username}</span>
            </div>

            <button className="header__logout" onClick={logout}>
              <span className="header__logout-icon">⟶</span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;