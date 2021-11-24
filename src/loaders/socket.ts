import { createServer, Server as httpServer } from 'http';
import { Server } from 'socket.io';
import { addEventListenerToSocket } from '../api/Shared/Services/socketService';

let io: Server;
let socketServer: httpServer;

const server = (app: Express.Application) => createServer(app);

const socketInit = (app: Express.Application) => {
  if (!io) {
    socketServer = server(app);
    io = new Server(socketServer);
    addEventListenerToSocket(io);
  }
};

export { socketInit, socketServer };
