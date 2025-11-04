import axios from 'axios';

const API_URL = 'https://y-utilitybackend.onrender.com/api';

// Players
export const getPlayers = () => axios.get(`${API_URL}/players`);
export const getPlayer = (id) => axios.get(`${API_URL}/players/${id}`);
export const createPlayer = (player) => axios.post(`${API_URL}/players`, player);
export const approvePlayer = (id) => axios.put(`${API_URL}/players/${id}/approve`);
export const addAttendance = (id, record) => axios.post(`${API_URL}/players/${id}/attendance`, record);
export const addHomeVisit = (id, record) => axios.post(`${API_URL}/players/${id}/homevisit`, record);
export const addLsas = (id, record) => axios.post(`${API_URL}/players/${id}/lsas`, record);

// Teams
export const getTeams = () => axios.get(`${API_URL}/teams`);
export const createTeam = (team) => axios.post(`${API_URL}/teams`, team);
export const addPlayerToTeam = (teamId, playerId) => axios.post(`${API_URL}/teams/${teamId}/add-player`, { playerId });
export const removePlayerFromTeam = (teamId, playerId) => axios.post(`${API_URL}/teams/${teamId}/remove-player`, { playerId });
export const recordTeamAttendance = (teamId, payload) => axios.post(`${API_URL}/teams/${teamId}/attendance`, payload);

// Tournaments
export const getTournaments = () => axios.get(`${API_URL}/tournaments`);
export const createTournament = (tournament) => axios.post(`${API_URL}/tournaments`, tournament);
export const addTeamToTournament = (tournamentId, teamId) => axios.post(`${API_URL}/tournaments/${tournamentId}/add-team`, { teamId });

// Matches
export const getMatches = () => axios.get(`${API_URL}/matches`);
export const createMatch = (match) => axios.post(`${API_URL}/matches`, match);
export const updateMatch = (id, payload) => axios.put(`${API_URL}/matches/${id}`, payload);
export const getLeaderboard = (tournamentId) => axios.get(`${API_URL}/matches/leaderboard/${tournamentId}`);

export default axios;
