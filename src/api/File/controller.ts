import LoggerInstance from '../../loaders/logger';

export const uploadFileController = async (filename: string, buffer: Buffer, mimeType: string, size: number) => {
  LoggerInstance.info('File received');
};
