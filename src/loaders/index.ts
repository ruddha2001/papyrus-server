import database from './database';
import express from './express';
import Logger from './logger';
import Express from 'express';
import { redisInit } from './redis';
import { socketInit } from './socket';

export default async ({ expressApp }: { expressApp: Express.Application }): Promise<void> => {
  await redisInit();
  Logger.info(`✅ Connection to redis successful`);

  await database();
  Logger.info(`✅ Connection to database successful`);

  await express({ app: expressApp });
  Logger.info('✅ Express loaded');

  socketInit(expressApp);
  Logger.info('✅ Socket.io connected');

  Logger.info('✅ All modules loaded!');
};
