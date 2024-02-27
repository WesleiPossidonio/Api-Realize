const multer = require('multer');
const { v4 } = require('uuid');
const { extname } = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const { Readable } = require('stream');
dotenv.config();

const multerConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  },
};

const upload = multer(multerConfig);

// Middleware que realiza o upload para o Google Drive
const uploadToGoogleDrive = async (req, res, next) => {
  try {
    console.log('req.files:', req.files);

    if (!req.files) {
      throw new Error('Nenhum arquivo encontrado');
    }

    const { 
      path_banner, 
      path_img, 
      first_img, 
      second_img, 
      third_img, 
      fourth_img 
    } = req.files;

    if (!path_banner || !path_img || !first_img || !second_img || !third_img || !fourth_img) {
      throw new Error('Imagens não encontradas');
    }

    const uploadPromises = [];

    const uploadFile = async (arquivo, fieldName) => {
      const fileExt = extname(arquivo.originalname); 
      const nomeArquivo = `${v4()}${fileExt}`; 
    
      const auth = new google.auth.GoogleAuth({
        credentials: {
          type: process.env.GOOGLE_DRIVE_TYPE,
          project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
          auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
          token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_CERT_URL,
          client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_CERT_URL,
          universe_domain: process.env.GOOGLE_DRIVE_UNIVERSE_DOMAIN
        },
        scopes: 'https://www.googleapis.com/auth/drive'
      });

      const drive = google.drive({ version: 'v3', auth });
    
      const fileMetadata = {
        name: nomeArquivo,
        parents: [`${process.env.GOOGLE_API_FOLDER_ID}`]
      };
    
      const media = {
        mimeType: arquivo.mimetype,
        body: Readable.from([arquivo.buffer])
      };
    
      try {
        const response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'webViewLink, id' // Adicione 'id' para obter o ID do arquivo
        });
    
        const fileId = response.data.id;
        const directLink = `https://lh3.googleusercontent.com/d/${fileId}?authuser=0`;
        
        // Armazenar o link direto na requisição para uso posterior
        req[fieldName] = directLink;
      } catch (error) {
        console.error('Erro ao fazer upload da imagem para o Google Drive:', error);
        throw error;
      }
    };

    uploadPromises.push(uploadFile(path_banner[0], 'path_banner'));
    uploadPromises.push(uploadFile(path_img[0], 'path_img'));
    uploadPromises.push(uploadFile(first_img[0], 'first_img'));
    uploadPromises.push(uploadFile(second_img[0], 'second_img'));
    uploadPromises.push(uploadFile(third_img[0], 'third_img'));
    uploadPromises.push(uploadFile(fourth_img[0], 'fourth_img'));

    await Promise.all(uploadPromises);

    next();
  } catch (error) {
    console.error('Error in uploadToGoogleDrive middleware:', error); // Log the error
    return res.status(400).json({ error: error.message });
  }
};
exports.upload = upload;
exports.uploadToGoogleDrive = uploadToGoogleDrive;