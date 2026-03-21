import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.response?.data?.error || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__header">
          <h1 className="login__title">Sistema de Mensajeria</h1>
          <p className="login__subtitle">WhatsApp Business</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          {error && <div className="login__error">{error}</div>}

          <div className="login__field">
            <label className="login__label" htmlFor="username">Usuario</label>
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

          <div className="login__field">
            <label className="login__label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button className="login__button" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesion'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
