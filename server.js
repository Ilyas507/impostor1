const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let rooms = {}; // Estructura: { roomCode: { players: [], host: id, gameState: 'lobby' } }

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Crear sala
  socket.on('createRoom', (playerName) => {
    const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    rooms[roomCode] = {
      players: [{ id: socket.id, name: playerName, role: 'crew', voted: false }],
      host: socket.id,
      gameState: 'lobby',
      votes: {}
    };
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
    io.to(roomCode).emit('updatePlayers', rooms[roomCode].players);
  });

  // Unirse a sala
  socket.on('joinRoom', (roomCode, playerName) => {
    if (rooms[roomCode] && rooms[roomCode].players.length < 10) { // Límite de 10 jugadores
      rooms[roomCode].players.push({ id: socket.id, name: playerName, role: 'crew', voted: false });
      socket.join(roomCode);
      io.to(roomCode).emit('updatePlayers', rooms[roomCode].players);
      socket.emit('joinedRoom', roomCode);
    } else {
      socket.emit('error', 'Código inválido o sala llena');
    }
  });

  // Iniciar juego (solo host)
  socket.on('startGame', (roomCode) => {
    if (rooms[roomCode] && rooms[roomCode].host === socket.id) {
      // Asignar roles (ej. 1 impostor por cada 4 jugadores)
      const players = rooms[roomCode].players;
      const impostorCount = Math.max(1, Math.floor(players.length / 4));
      const impostors = players.sort(() => 0.5 - Math.random()).slice(0, impostorCount);
      impostors.forEach(p => p.role = 'impostor');
      rooms[roomCode].gameState = 'playing';
      io.to(roomCode).emit('gameStarted', players);
    }
  });

  // Chat
  socket.on('sendMessage', (roomCode, message) => {
    io.to(roomCode).emit('newMessage', { sender: socket.id, message });
  });

  // Votación
  socket.on('vote', (roomCode, votedPlayerId) => {
    if (rooms[roomCode] && rooms[roomCode].gameState === 'voting') {
      rooms[roomCode].votes[votedPlayerId] = (rooms[roomCode].votes[votedPlayerId] || 0) + 1;
      const voter = rooms[roomCode].players.find(p => p.id === socket.id);
      if (voter) voter.voted = true;
      io.to(roomCode).emit('updateVotes', rooms[roomCode].votes);
      // Si todos votaron, procesar resultado
      if (rooms[roomCode].players.every(p => p.voted)) {
        const maxVotes = Math.max(...Object.values(rooms[roomCode].votes));
        const expelled = Object.keys(rooms[roomCode].votes).find(id => rooms[roomCode].votes[id] === maxVotes);
        io.to(roomCode).emit('voteResult', expelled);
        rooms[roomCode].gameState = 'playing';
      }
    }
  });

  // Iniciar votación (ej. botón de emergencia)
  socket.on('startVote', (roomCode) => {
    rooms[roomCode].gameState = 'voting';
    rooms[roomCode].votes = {};
    rooms[roomCode].players.forEach(p => p.voted = false);
    io.to(roomCode).emit('votingStarted');
  });

  socket.on('disconnect', () => {
    // Limpiar salas (remover jugador)
    for (const code in rooms) {
      rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
      if (rooms[code].players.length === 0) delete rooms[code];
      else io.to(code).emit('updatePlayers', rooms[code].players);
    }
  });
});

server.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
