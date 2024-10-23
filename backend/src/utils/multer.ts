import multer from 'multer';

// Use memory storage so that files are stored in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
