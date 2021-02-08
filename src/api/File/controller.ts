import { promisify } from 'util';
import database from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';
import redis from '../../loaders/redis';
import { PapyrusObject } from '../Shared/customTypes';
import { getSignedUrlFromS3, uploadFileToS3 } from '../Shared/Services/s3Service';

const redisGetPromise = promisify(redis().get).bind(redis());
const redisExistsPromise = promisify(redis().exists).bind(redis());

/**
 * Add a file to S3 and add entry to database and cache
 * @param {string} email The email address of the logged in user
 * @param {string} title The title of the object
 * @param {string} filename The original filename
 * @param {string} buffer The buffer of the file
 * @param {string} mimeType The mime type of the file
 * @param {number} size The size of the file in bytes
 */
export const uploadFileController = async (
  email: string,
  title: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
  size: number,
) => {
  try {
    const uniquekey = await uploadFileToS3(filename, buffer, mimeType);
    let { storageObject } = (await (await database()).collection('userdata').findOne({ email: email })) || {};
    if (storageObject === undefined) storageObject = [];
    const newPapyrusObject: PapyrusObject = {
      title: title,
      body: uniquekey,
      type: 'file',
      modified: Date.now(),
      originalName: filename,
    };
    storageObject.push(newPapyrusObject); // Add the new object

    // Check if the new object is the first object; add or update document accordingly
    if (storageObject.length === 1)
      await (await database()).collection('userdata').insertOne({ email: email, storageObject: storageObject });
    else
      await (await database())
        .collection('userdata')
        .updateOne({ email: email }, { $set: { storageObject: storageObject } });

    redis().set(title, await downloadFileController(email, uniquekey)); // Store the Signed URL in redis
    return uniquekey;
  } catch (error) {
    LoggerInstance.error(error);
    throw error;
  }
};

/**
 * Get signed URL for the title
 * @param {string} email The email address of the logged in user
 * @param {string} key The title of the file to be downloaded
 */
export const downloadFileController = async (email: string, title: string) => {
  try {
    // Check if Signed URL exists in the cache
    if (await redisExistsPromise(title)) return await (<string>redisGetPromise(title));
    let { storageObject } = await (await database()).collection('userdata').findOne({ email: email });
    let entry = storageObject.filter(object => object.title === title);
    if (entry.length === 0) throw Error('Title was not found');
    return await getSignedUrlFromS3(entry[0].body);
  } catch (error) {
    LoggerInstance.error(error);
    throw error;
  }
};
