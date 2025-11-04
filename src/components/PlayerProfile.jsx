import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayer, approvePlayer, addAttendance, addHomeVisit, addLsas } from '../services/api';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [attNote, setAttNote] = useState('');
  const [visitor, setVisitor] = useState('');
  const [lsasScore, setLsasScore] = useState('');

  const fetch = () => {
    getPlayer(id)
      .then((res) => setPlayer(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleApprove = () => {
    approvePlayer(id).then(() => fetch()).catch((e) => console.error(e));
  };

  const handleAttendance = (e) => {
    e.preventDefault();
    addAttendance(id, { present: true, note: attNote })
      .then(() => { setAttNote(''); fetch(); })
      .catch((e) => console.error(e));
  };

  const handleHomeVisit = (e) => {
    e.preventDefault();
    addHomeVisit(id, { visitor, notes: 'Recorded via app' })
      .then(() => { setVisitor(''); fetch(); })
      .catch((e) => console.error(e));
  };

  const handleLsas = (e) => {
    e.preventDefault();
    addLsas(id, { score: Number(lsasScore) })
      .then(() => { setLsasScore(''); fetch(); })
      .catch((e) => console.error(e));
  };

  if (!player) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{player.name}</h2>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Gender:</strong> {player.gender || 'N/A'}</p>
      <p><strong>Approved:</strong> {player.approved ? 'Yes' : 'No'}</p>
      {!player.approved && <button onClick={handleApprove}>Approve Player</button>}

      <section>
        <h3>Attendance</h3>
        <form onSubmit={handleAttendance} className="inline-form">
          <input value={attNote} onChange={(e) => setAttNote(e.target.value)} placeholder="Note" />
          <button type="submit">Add Attendance</button>
        </form>
        <ul>
          {player.attendance && player.attendance.map((a, idx) => (
            <li key={idx}>{new Date(a.date).toLocaleString()} - {a.present ? 'Present' : 'Absent'} - {a.note}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Home Visits</h3>
        <form onSubmit={handleHomeVisit} className="inline-form">
          <input value={visitor} onChange={(e) => setVisitor(e.target.value)} placeholder="Visitor name" required />
          <button type="submit">Add Home Visit</button>
        </form>
        <ul>
          {player.homeVisits && player.homeVisits.map((h, idx) => (
            <li key={idx}>{new Date(h.date).toLocaleDateString()} - {h.visitor} - {h.notes}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>LSAS Assessments</h3>
        <form onSubmit={handleLsas} className="inline-form">
          <input value={lsasScore} onChange={(e) => setLsasScore(e.target.value)} placeholder="Score" required />
          <button type="submit">Add LSAS</button>
        </form>
        <ul>
          {player.lsas && player.lsas.map((l, idx) => (
            <li key={idx}>{new Date(l.date).toLocaleDateString()} - Score: {l.score} - {l.notes}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PlayerProfile;
