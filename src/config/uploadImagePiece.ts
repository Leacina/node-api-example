import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', 'piece');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      console.log(file);
      console.log(request);
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `b4t3u${fileHash}-${file.originalname}`;
      console.log(fileName);
      return callback(null, fileName);
    },
  }),
};
