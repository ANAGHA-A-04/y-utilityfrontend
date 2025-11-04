import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlayers, createPlayer, approvePlayer } from '../services/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = () => {
    getPlayers()
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPlayer({ name, email })
      .then(() => {
        fetchPlayers();
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error('There was an error creating the player!', error);
      });
  };

  return (
    <div className="container">
      <h1 className="page-title">Player Management</h1>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} className="inline-form">
          <input className="form-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn" type="submit">Add Player</button>
        </form>
      </div>

      <ul className="data-list">
        {players.map(player => (
          <li key={player._id}>
            <span>
              <Link to={`/players/${player._id}`}>{player.name}</Link> ({player.email}) - <strong>{player.approved ? 'Approved' : 'Pending'}</strong>
            </span>
            {!player.approved && (
              <button className="btn secondary" onClick={() => approvePlayer(player._id).then(fetchPlayers)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
