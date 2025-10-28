import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { NotificationContainer } from './components/Notification';
import Login from './pages/Login';
import Registro from './pages/Registro';
import './index.css';

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <NotificationContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;