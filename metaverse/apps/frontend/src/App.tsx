import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import CreateSpace from './pages/CreateSpace';
import JoinSpace from './pages/JoinSpace';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import Game from './pages/Game';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          {/* Define routes with corresponding components */}
          <Route path="/signin" element={<LoginPage />} /> {/* Login Page */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/game" element={<Game />} />
          <Route path="/create-space" element={<CreateSpace />} /> {/* Create Space page */}
          <Route path="/join-space" element={<JoinSpace />} /> {/* Join Space page */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
