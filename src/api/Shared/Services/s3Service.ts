import { S3 } from 'aws-sdk';
const s3 = new S3();
const bucketName = process.env.S3_BUCKET_NAME || 'papyrusstoragedump';

export const uploadFileToS3 = async (filename: string, buffer: Buffer) => {
  await s3.putObject({
    Bucket: bucketName,
  });
};
