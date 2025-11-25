const socket = io();
let currentRoom = null;
let myRole = null;

// Elementos DOM
const menu = document.getElementById('menu');
const lobby = document.getElementById('lobby');
const game = document.getElementById('game');
const errorEl = document.getElementById('error');

// Crear sala
document.getElementById('createRoom').addEventListener('click', () => {
  const name = document.getElementById('playerName').value;
  if (name) socket.emit('createRoom', name);
});

socket.on('roomCreated', (code) => {
  currentRoom = code;
  document.getElementById('currentRoomCode').textContent = code;
  menu.classList.add('hidden');
  lobby.classList.remove('hidden');
});

// Unirse
document.getElementById('joinRoom').addEventListener('click', () => {
  const code = document.getElementById('roomCode').value.toUpperCase();
  const name = document.getElementById('playerName').value;
  if (code && name) socket.emit('joinRoom', code, name);
});

socket.on('joinedRoom', (code) => {
  currentRoom = code;
  document.getElementById('currentRoomCode').textContent = code;
  menu.classList.add('hidden');
  lobby.classList.remove('hidden');
});

socket.on('error', (msg) => {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
});

// Actualizar lista de jugadores
socket.on('updatePlayers', (players) => {
  const list = document.getElementById('playersList');
  list.innerHTML = players.map(p => `<p>${p.name} (${p.role})</p>`).join('');
});

// Iniciar juego
document.getElementById('startGame').addEventListener('click', () => {
  socket.emit('startGame', currentRoom);
});

socket.on('gameStarted', (players) => {
  lobby.classList.add('hidden');
  game.classList.remove('hidden');
  const me = players.find(p => p.id === socket.id);
  myRole = me.role;
  document.getElementById('role').textContent = `Tu rol: ${myRole}`;
});

// Chat
document.getElementById('sendMessage').addEventListener('click', () => {
  const msg = document.getElementById('messageInput').value;
  if (msg) {
    socket.emit('sendMessage', currentRoom, msg);
    document.getElementById('messageInput').value = '';
  }
});

socket.on('newMessage', (data) => {
  const messages = document.getElementById('messages');
  messages.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
  messages.scrollTop = messages.scrollHeight;
});

// Votación
document.getElementById('emergency').addEventListener('click', () => {
  socket.emit('startVote', currentRoom);
});

socket.on('votingStarted', () => {
  document.getElementById('vote').classList.remove('hidden');
  // Generar botones de votación (simplificado)
  const buttons = document.getElementById('voteButtons');
  buttons.innerHTML = '<button class="voteBtn bg-red-500 p-2 m-1 rounded" data-id="skip">Saltar</button>';
  // Agrega botones para cada jugador (necesitas obtener lista actualizada)
});

// Ejemplo de votar (ajusta para botones dinámicos)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('voteBtn')) {
    const votedId = e.target.dataset.id;
    socket.emit('vote', currentRoom, votedId);
  }
});

socket.on('updateVotes', (votes) => {
  console.log('Votos actualizados:', votes);
});

socket.on('voteResult', (expelledId) => {
  alert(`Jugador expulsado: ${expelledId}`);
  document.getElementById('vote').classList.add('hidden');
});
