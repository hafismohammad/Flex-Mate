import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Serve static files from the public folder
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads')); 
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname}`; 
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

export default upload;
