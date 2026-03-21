import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Templates from './pages/Templates/Templates';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
