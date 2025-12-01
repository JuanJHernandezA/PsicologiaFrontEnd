import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { NotificationContainer } from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import './index.css';
//import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gestion from './pages/Gestion';
import Agendar from './pages/Agendar';
import MisCitas from './pages/MisCitas';
import Admin from './pages/Admin';

function LoginRedirect() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Login />;
}

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <NotificationContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas protegidas para Estudiantes */}
            <Route 
              path="/agendar" 
              element={
                <ProtectedRoute allowedRoles={['Estudiante']}>
                  <Agendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mis-citas" 
              element={
                <ProtectedRoute allowedRoles={['Estudiante']}>
                  <MisCitas />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta protegida para Psicólogos */}
            <Route 
              path="/gestion" 
              element={
                <ProtectedRoute allowedRoles={['Psicologo']}>
                  <Gestion />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta protegida solo para Administradores */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;