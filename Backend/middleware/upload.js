// Backend/middleware/upload.js
import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (simpler for Cloudinary upload)
const storage = multer.memoryStorage();

// Configure multer to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // Limit file size to 50MB
  }
});

export default upload;