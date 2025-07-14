import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Users, Brain, BookOpen, BarChart3 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import MentalState from './pages/MentalState';
import Subscribers from './pages/Subscribers';
import Diaries from './pages/Diaries';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>AI Influencer</h2>
            <p>Manager Portal</p>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="nav-link">
                <MessageSquare size={20} />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/mental-state" className="nav-link">
                <Brain size={20} />
                <span>Mental State</span>
              </Link>
            </li>
            <li>
              <Link to="/subscribers" className="nav-link">
                <Users size={20} />
                <span>Subscribers</span>
              </Link>
            </li>
            <li>
              <Link to="/diaries" className="nav-link">
                <BookOpen size={20} />
                <span>Diaries</span>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/mental-state" element={<MentalState />} />
            <Route path="/subscribers" element={<Subscribers />} />
            <Route path="/diaries" element={<Diaries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


// export default App;
export default App; 