
import multer from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

import * as dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PORJECT_ID,
  storageBucket:process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGIN_SENDERG_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

initializeApp(firebaseConfig);
const storage = getStorage();

const multerConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  },
};

const upload = multer(multerConfig);

// Middleware que realiza o upload para o Firebase Storage
const uploadToFirebase = async (req, res, next) => {
  try {
    console.log('req.files:', req.files);

    // Verifica se req.files está definido
    if (!req.files) {
      throw new Error('Nenhum arquivo encontrado');
    }

    const { path_banner, path_img, path_companies_img } = req.files;

    // Verifica se path_banner, path_img e path_companies_img estão definidos
    if (!path_banner || !path_img || !path_companies_img) {
      throw new Error('Imagens não descobertas');
    }

    const uploadPromises = [];

    const uploadFile = async (arquivo, fieldName) => {
      for (const image of arquivo) {
        const fileExt = extname(image.originalname);
        const nomeArquivo = `${v4()}${fileExt}`;

        const fileRef = ref(storage, `realizeFiles/${nomeArquivo}`);

        try {
          await uploadBytes(fileRef, image.buffer);
          const downloadURL = await getDownloadURL(fileRef);
          req[fieldName].push(downloadURL);
        } catch (error) {
          console.error('Erro ao fazer upload do arquivo:', error);
          // Trate o erro conforme necessário
        }
      }
    };

    // Inicia o upload para path_banner e path_img
    uploadPromises.push(uploadFile(path_banner, 'path_banner'));
    uploadPromises.push(uploadFile(path_img, 'path_img'));
    uploadPromises.push(uploadFile(path_companies_img, 'path_companies_img'));


    await Promise.all(uploadPromises);

    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { upload, uploadToFirebase };


// import multer from 'multer';
// import { v4 } from 'uuid';
// import { extname, resolve } from 'path';

// export default {
//   storage: multer.diskStorage({
//     destination: resolve(__dirname, '..', '..', 'uploads'),
//     filename: (request, file, callback) => {
//       const uniqueFileName = v4() + extname(file.originalname);
//       callback(null, uniqueFileName);
//     },
//   }),
//   fileFilter: (request, file, callback) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/png']; 
//     if (allowedMimeTypes.includes(file.mimetype)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Tipo de arquivo não suportado'));
//     }
//   },
// };