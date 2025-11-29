import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { NotificationContainer } from './components/Notification';
import Login from './pages/Login';
import Registro from './pages/Registro';
import './index.css';
import Admin from './pages/Admin';
import MisCitas from './pages/MisCitas';
//import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gestion from './pages/Gestion';
import Agendar from './pages/Agendar';

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <NotificationContainer />
          <Routes>
            <Route
              path="/"
              element={
                
                  <Home />
                
              }
            />
            <Route
              path="/home"
              element={
                
                  <Home />
                
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/gestion"
              element={
                
                  <Gestion />
                
              }
            />
            <Route
              path="/agendar"
              element={
                
                  <Agendar />
                
              }
            />
            <Route
              path="/admin"
              element={
                
                  <Admin />
                
              }
            />
            <Route
              path="/mis-citas"
              element={
                
                  <MisCitas />
                
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
