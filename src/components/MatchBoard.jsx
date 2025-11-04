import React, { useEffect, useState } from 'react';
import { getMatches, createMatch, updateMatch, getTournaments, getTeams } from '../services/api';

const MatchBoard = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({ tournament: '', teamA: '', teamB: '', date: '', location: '' });

  const fetch = () => {
    getMatches().then((r) => setMatches(r.data)).catch((e) => console.error(e));
  };

  useEffect(() => {
    fetch();
    getTeams().then((r) => setTeams(r.data)).catch(() => {});
    getTournaments().then((r) => setTournaments(r.data)).catch(() => {});

    // polling when any match is live
    const interval = setInterval(() => {
      getMatches().then((r) => {
        setMatches(r.data);
      }).catch(() => {});
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    createMatch(form).then(() => { setForm({ tournament: '', teamA: '', teamB: '', date: '', location: '' }); fetch(); }).catch((e) => console.error(e));
  };

  const handleUpdate = (id, payload) => {
    updateMatch(id, payload).then(() => fetch()).catch((e) => console.error(e));
  };

  return (
    <div className="container">
      <h1 className="page-title">Match Board</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Create New Match</h2>
        <form onSubmit={handleCreate} className="grid-form">
          <select className="form-input" value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} required>
            <option value="">Select tournament</option>
            {tournaments.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select className="form-input" value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} required>
            <option value="">Select Team A</option>
            {teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select className="form-input" value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} required>
            <option value="">Select Team B</option>
            {teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input className="form-input" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <input className="form-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <button className="btn" type="submit">Create Match</button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.25rem' }}>Live & Upcoming Matches</h2>
      <div className="matches">
        {matches.map((m) => (
          <div key={m._id} className="match">
            <div className="match-info" style={{flex: 1}}>
              <h4>{m.teamA?.name || 'Team A'} vs {m.teamB?.name || 'Team B'}</h4>
              <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: 0}}>
                {m.tournament?.name} | {new Date(m.date).toLocaleString()} @ {m.location}
              </p>
            </div>
            <div className="match-controls" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
              <div>
                <label>Score A</label>
                <input className="form-input" style={{width: '80px'}} type="number" defaultValue={m.scoreA} onBlur={(e) => handleUpdate(m._id, { scoreA: Number(e.target.value) })} />
              </div>
              <div>
                <label>Score B</label>
                <input className="form-input" style={{width: '80px'}} type="number" defaultValue={m.scoreB} onBlur={(e) => handleUpdate(m._id, { scoreB: Number(e.target.value) })} />
              </div>
              <div>
                <label>Spirit A</label>
                <input className="form-input" style={{width: '80px'}} type="number" defaultValue={m.spiritA} onBlur={(e) => handleUpdate(m._id, { spiritA: Number(e.target.value) })} />
              </div>
              <div>
                <label>Spirit B</label>
                <input className="form-input" style={{width: '80px'}} type="number" defaultValue={m.spiritB} onBlur={(e) => handleUpdate(m._id, { spiritB: Number(e.target.value) })} />
              </div>
              <div>
                <label>Status</label>
                <select className="form-input" defaultValue={m.status} onChange={(e) => handleUpdate(m._id, { status: e.target.value })}>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchBoard;
