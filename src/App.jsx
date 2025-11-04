import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Players from './components/Players';
import Teams from './components/Teams';
import Tournaments from './components/Tournaments';
import Dashboard from './components/Dashboard';
import PlayerProfile from './components/PlayerProfile';
import MatchBoard from './components/MatchBoard';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import './App.css';
import './components/Footer.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
                <header className="app-header">
          <div className="header-container">
            <h1>Y-Ultimate Management</h1>
            <nav>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
              <NavLink to="/players" className={({ isActive }) => (isActive ? 'active' : '')}>Players</NavLink>
              <NavLink to="/teams" className={({ isActive }) => (isActive ? 'active' : '')}>Teams</NavLink>
              <NavLink to="/tournaments" className={({ isActive }) => (isActive ? 'active' : '')}>Tournaments</NavLink>
              <NavLink to="/matches" className={({ isActive }) => (isActive ? 'active' : '')}>Matches</NavLink>
              <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active' : '')}>Leaderboard</NavLink>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/matches" element={<MatchBoard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
