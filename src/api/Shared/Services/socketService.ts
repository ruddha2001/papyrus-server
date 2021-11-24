import { Server } from 'socket.io';
import { customAlphabet } from 'nanoid';
import LoggerInstance from '../../../loaders/logger';
import redis from '../../../loaders/redis';
import { promisify } from 'util';

const nanoid = customAlphabet('123456789', 6);
const redisGetPromise = promisify(redis().get).bind(redis());
const redisExistsPromise = promisify(redis().exists).bind(redis());
const redisSetPromise = promisify(redis().set).bind(redis());

export const addEventListenerToSocket = (io: Server) => {
  io.sockets.on('connection', async socket => {
    LoggerInstance.info(`New Socket Connection: ${socket.id}`);
    if (socket.handshake.query.client === 'cli') {
      let roomId = nanoid();
      socket.join(roomId);
      await redisSetPromise(socket.handshake.query.clientId, roomId);
      LoggerInstance.info(`CLI Socket is connected to room ${roomId}`);
    } else {
      let exists = await redisExistsPromise(socket.handshake.query.clientId);
      if (exists) {
        let roomId = await redisGetPromise(socket.handshake.query.clientId);
        socket.join(roomId);
        LoggerInstance.info(`CLI Socket is connected to room ${roomId}`);
      }
    }

    socket.on('message', message => {
      LoggerInstance.info(JSON.stringify(message));
    });

    socket.on('login', async login => {
      io.to(await redisGetPromise(socket.handshake.query.clientId)).emit('room creation', {
        socket: socket.id,
        clientId: login.clientId,
      });
    });

    socket.on('verification', async verification => {
      try {
        console.log(
          'Verification',
          io.sockets.adapter.rooms.get(await redisGetPromise(socket.handshake.query.clientId)).size,
        );

        io.to(await redisGetPromise(socket.handshake.query.clientId)).emit('login successful', {
          clientId: verification.clientId,
          authToken: verification.authToken,
        });
      } catch (error) {
        LoggerInstance.error('Room does not exist');
      }
    });
  });
};
