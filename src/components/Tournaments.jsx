import React, { useState, useEffect } from 'react';
import { getTournaments, createTournament, getTeams, addTeamToTournament } from '../services/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetchTournaments();
    getTeams().then((r) => setTeams(r.data)).catch(() => {});
  }, []);

  const fetchTournaments = () => {
    getTournaments()
      .then(response => {
        setTournaments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tournaments!', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTournament({ name, startDate, endDate })
      .then(() => {
        fetchTournaments();
        setName('');
        setStartDate('');
        setEndDate('');
      })
      .catch(error => {
        console.error('There was an error creating the tournament!', error);
      });
  };

  const handleSelectTournament = (t) => {
    if (selectedTournament && selectedTournament._id === t._id) {
      setSelectedTournament(null); // Toggle off if already selected
    } else {
      setSelectedTournament(t);
    }
  };

  const handleAddTeam = () => {
    if (!selectedTournament || !selectedTeam) return;
    addTeamToTournament(selectedTournament._id, selectedTeam).then(() => {
      fetchTournaments();
      setSelectedTeam('');
    }).catch((e) => console.error(e));
  };

  return (
    <div className="container">
      <h1 className="page-title">Tournaments</h1>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Create New Tournament</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <input className="form-input" type="text" placeholder="Tournament Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="form-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <input className="form-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          <button className="btn" type="submit">Add Tournament</button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.25rem' }}>All Tournaments</h2>
      <ul className="data-list">
        {tournaments.map(t => (
          <React.Fragment key={t._id}>
            <li>
              <span>
                <strong>{t.name}</strong> ({new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()})
              </span>
              <button className="btn secondary" onClick={() => handleSelectTournament(t)}>
                {selectedTournament && selectedTournament._id === t._id ? 'Close' : 'Manage'}
              </button>
            </li>
            {selectedTournament && selectedTournament._id === t._id && (
              <li className="management-panel">
                <div>
                  <h3>Manage Teams for {t.name}</h3>
                  <div className="inline-form">
                    <select className="form-input" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                      <option value="">Select a team to add</option>
                      {teams.filter(team => !t.teams?.includes(team._id)).map(team => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                      ))}
                    </select>
                    <button className="btn" onClick={handleAddTeam}>Add Team</button>
                  </div>

                  <h4>Teams in Tournament</h4>
                  <ul>
                    {(t.teams || []).map(tid => {
                      const team = teams.find(x => x._id === tid) || { name: '...' };
                      return <li key={tid}>{team.name}</li>;
                    })}
                  </ul>
                </div>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Tournaments;
