import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { off } from 'process';

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:8080', 'http://10.58.52.111:8080'],
		// allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
});

app.use(cors());

app.get('/', (req, res) => {
	res.send('hello 3000');
});

// socket 통신
io.on('connection', socket => {
	console.log('연결됨');
	socket.on('join_room', roomName => {
		console.log('romm', roomName);
		socket.join(roomName);
		socket.to(roomName).emit('welcome');
	});

	socket.on('message', msg => {
		console.log('앖ㅇ,ㅁ??', msg);
		io.emit('chat message', msg);
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
