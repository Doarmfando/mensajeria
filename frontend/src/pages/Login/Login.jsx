import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__header">

          <div className="login__brand">
            <div className="login__logo-wrap">
              <img src="/logo_icon_blanco.png" alt="Fortex" className="login__logo" />
            </div>

            <div className="login__brand-text">
              <span className="login__brand-name">FORTEX</span>
            </div>
          </div>

          <p className="login__description">
            Ingresa con tus credenciales para acceder al panel de gestión y envíos.
          </p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          {error && <div className="login__error">{error}</div>}

          <div className="login__field">
            <label className="login__label" htmlFor="username">
              Usuario
            </label>
            <div className="login__input-wrapper">
              <input
                id="username"
                className="login__input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">
              Contraseña
            </label>
            <div className="login__input-wrapper">
              <input
                id="password"
                className="login__input login__input--password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="login__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button className="login__button" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="login__footer">
          Solo usuarios autorizados pueden acceder a esta plataforma.
        </div>
      </div>
    </div>
  );
}

export default Login;