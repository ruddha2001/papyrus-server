import { createClient } from 'redis';
const redisClient = createClient();

export const redisInit = async () => {
  redisClient.on('connect', () => {
    return redisClient;
  });
};

export default () => {
  return redisClient;
};
