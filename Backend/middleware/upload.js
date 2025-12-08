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
    console.warn(`[Upload Middleware] Rejected file with mimetype: ${file.mimetype}`);
    cb(new Error(`Only PDF files are allowed! Received: ${file.mimetype}`), false);
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