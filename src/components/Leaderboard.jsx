import React, { useEffect, useState } from 'react';
import { getTournaments, getLeaderboard } from '../services/api';

const Leaderboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState('');
  const [board, setBoard] = useState([]);

  useEffect(() => {
    getTournaments().then((r) => setTournaments(r.data)).catch(() => {});
  }, []);

  const fetchBoard = (tId) => {
    setSelected(tId);
    getLeaderboard(tId).then((r) => setBoard(r.data)).catch((e) => console.error(e));
  };

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      <select value={selected} onChange={(e) => fetchBoard(e.target.value)}>
        <option value="">Select tournament</option>
        {tournaments.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
      </select>

      <table className="leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Wins</th>
            <th>Points For</th>
            <th>Points Against</th>
            <th>Spirit Total</th>
          </tr>
        </thead>
        <tbody>
          {board.map((b, idx) => (
            <tr key={b.team._id}>
              <td>{idx + 1}</td>
              <td>{b.team.name}</td>
              <td>{b.wins}</td>
              <td>{b.pointsFor}</td>
              <td>{b.pointsAgainst}</td>
              <td>{b.spiritTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
