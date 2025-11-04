import React, { useEffect, useState } from 'react';
import { getPlayers, getTeams, getTournaments, getMatches } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [counts, setCounts] = useState({ players: 0, teams: 0, tournaments: 0, matches: 0 });

  useEffect(() => {
    Promise.all([getPlayers(), getTeams(), getTournaments(), getMatches()])
      .then(([p, t, tour, m]) => {
        setCounts({ players: p.data.length, teams: t.data.length, tournaments: tour.data.length, matches: m.data.length });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Y-Ultimate Dashboard</h1>
      <div className="grid">
        <div className="card">
          <h3>Players</h3>
          <p className="big">{counts.players}</p>
          <Link to="/players">Manage Players</Link>
        </div>
        <div className="card">
          <h3>Teams</h3>
          <p className="big">{counts.teams}</p>
          <Link to="/teams">Manage Teams</Link>
        </div>
        <div className="card">
          <h3>Tournaments</h3>
          <p className="big">{counts.tournaments}</p>
          <Link to="/tournaments">Manage Tournaments</Link>
        </div>
        <div className="card">
          <h3>Matches</h3>
          <p className="big">{counts.matches}</p>
          <Link to="/matches">Manage Matches</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
