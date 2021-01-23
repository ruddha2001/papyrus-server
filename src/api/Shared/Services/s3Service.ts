import { S3 } from 'aws-sdk';
import nanoid from 'nanoid';
const s3 = new S3();
const bucketName = process.env.S3_BUCKET_NAME || 'papyrusstoragedump';

export const uploadFileToS3 = async (filename: string, buffer: Buffer, mimeType: string) => {
  const uniquekey = nanoid.customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10) + filename;
  await s3.putObject({
    Bucket: bucketName,
    Key: uniquekey,
    ContentType: mimeType,
    Body: buffer,
  });
  return uniquekey;
};
