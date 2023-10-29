import multer from 'multer';
import { v4 } from 'uuid';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
      const uniqueFileName = v4() + extname(file.originalname);
      callback(null, uniqueFileName);
    },
  }),
  fileFilter: (request, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png']; 
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de arquivo não suportado'));
    }
  },
};