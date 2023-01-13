import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
	path: '.env.development',
});

const app = express();
const server = createServer();

const io = new Server(server, {
	cors: {
		origin: [process.env.NODE_ENV_LOCAL_IP, process.env.NODE_ENV_WIFI_IP],
		credentials: true,
	},
});

app.use(cors());

app.get('/', (req, res) => {
	res.send('hello 3000');
});

// socket 통신
io.on('connection', socket => {
	console.log('welcome socket connection');

	socket.on('join_room', roomName => {
		socket.join(roomName);
		socket.to(roomName).emit('welcome');
	});

	socket.on('message', (msg, roomName) => {
		socket.to(roomName).emit('message', msg);
	});

	socket.on('offer', (offer, roomName) => {
		socket.to(roomName).emit('offer', offer);
	});

	socket.on('answer', (answer, roomName) => {
		socket.to(roomName).emit('answer', answer);
	});

	socket.on('ice', (ice, roomName) => {
		socket.to(roomName).emit('ice', ice);
	});
});

server.listen(3001, () => {
	console.log('http://localhost:3001 연결 ');
});
