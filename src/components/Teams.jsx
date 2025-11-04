import React, { useState, useEffect } from 'react';
import { getTeams, createTeam, getPlayers, addPlayerToTeam, removePlayerFromTeam, recordTeamAttendance } from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    fetchTeams();
    getPlayers().then((r) => setPlayers(r.data)).catch(() => {});
  }, []);

  const fetchTeams = () => {
    getTeams()
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the teams!', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTeam({ name })
      .then(() => {
        fetchTeams();
        setName('');
      })
      .catch(error => {
        console.error('There was an error creating the team!', error);
      });
  };

  const handleSelectTeam = (team) => {
    if (selectedTeam && selectedTeam._id === team._id) {
      setSelectedTeam(null); // Toggle off
    } else {
      setSelectedTeam(team);
      // initialize attendance map
      const map = {};
      (team.players || []).forEach((p) => { map[p._id] = true; });
      setAttendanceMap(map);
    }
  };

  const handleAddPlayer = () => {
    if (!selectedTeam || !selectedPlayer) return;
    addPlayerToTeam(selectedTeam._id, selectedPlayer).then(() => {
      fetchTeams();
      setSelectedPlayer('');
    }).catch((e) => console.error(e));
  };

  const handleRemovePlayer = (playerId) => {
    if (!selectedTeam) return;
    removePlayerFromTeam(selectedTeam._id, playerId).then(fetchTeams).catch((e) => console.error(e));
  };

  const handleRecordAttendance = () => {
    if (!selectedTeam) return;
    const attendance = Object.keys(attendanceMap).map((playerId) => ({ player: playerId, present: !!attendanceMap[playerId] }));
    recordTeamAttendance(selectedTeam._id, { date: new Date(), attendance }).then(() => alert('Attendance recorded')).catch((e) => console.error(e));
  };

  return (
    <div className="container">
      <h1 className="page-title">Team Management</h1>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Create New Team</h2>
        <form onSubmit={handleSubmit} className="inline-form">
          <input className="form-input" type="text" placeholder="Team Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button className="btn" type="submit">Add Team</button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.25rem' }}>All Teams</h2>
      <ul className="data-list">
        {teams.map(team => (
          <React.Fragment key={team._id}>
            <li>
              <span>
                <strong>{team.name}</strong> ({team.players ? team.players.length : 0} players)
              </span>
              <button className="btn secondary" onClick={() => handleSelectTeam(team)}>
                {selectedTeam && selectedTeam._id === team._id ? 'Close' : 'Manage'}
              </button>
            </li>

            {selectedTeam && selectedTeam._id === team._id && (
              <li className="management-panel">
                <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
                  <div style={{flex: 1, minWidth: '250px'}}>
                    <h3>Roster</h3>
                    <div className="inline-form" style={{marginBottom: '1rem'}}>
                      <select className="form-input" value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
                        <option value="">Select player to add</option>
                        {players.filter(p => !team.players?.find(player => player._id === p._id)).map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                      <button className="btn" onClick={handleAddPlayer}>Add</button>
                    </div>
                    <ul>
                      {team.players && team.players.map(p => (
                        <li key={p._id} style={{padding: '0.5rem 0', justifyContent: 'space-between'}}>
                          {p.name} <button className="btn secondary" onClick={() => handleRemovePlayer(p._id)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{flex: 1, minWidth: '250px'}}>
                    <h3>Record Attendance</h3>
                    <div>
                      {(team.players || []).map(p => (
                        <div key={p._id} style={{display:'flex', alignItems:'center', gap:8, padding: '0.25rem 0'}}>
                          <label style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
                            <input type="checkbox" checked={!!attendanceMap[p._id]} onChange={(e) => setAttendanceMap({...attendanceMap, [p._id]: e.target.checked})} /> {p.name}
                          </label>
                        </div>
                      ))}
                      <div style={{marginTop: '1rem'}}>
                        <button className="btn" onClick={handleRecordAttendance}>Save Attendance</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
