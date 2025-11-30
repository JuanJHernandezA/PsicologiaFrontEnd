import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { NotificationContainer } from './components/Notification';
import Login from './pages/Login';
import Registro from './pages/Registro';
import './index.css';
//import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gestion from './pages/Gestion';
import Agendar from './pages/Agendar';
import MisCitas from './pages/MisCitas';
import Admin from './pages/Admin';

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <NotificationContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/gestion" element={<Gestion />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/mis-citas" element={<MisCitas />} />
            <Route path= "/admin" element={<Admin />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;