import LoggerInstance from '../../loaders/logger';
import { uploadFileToS3 } from '../Shared/Services/s3Service';

export const uploadFileController = async (
  title: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
  size: number,
) => {
  try {
    const uniquekey = await uploadFileToS3(filename, buffer, mimeType);
  } catch (error) {
    LoggerInstance.error(error);
    throw error;
  }
};
