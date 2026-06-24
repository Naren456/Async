import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';

import AuthRouter from './routes/auth.route.js';
import CourseraRouter from './routes/coursera.route.js';
import subjectRouter from './routes/subject.route.js';
import assignmentRouter from './routes/assignment.route.js';
import adminRouter from './routes/admin.route.js';
import notesRouter from './routes/note.route.js';
// import './jobs/assignmentCleanUp.js'; 
import './jobs/syncAssignment.js'
import scheduler from './cron/scheduler.js';

scheduler();



const app = express();
const PORT = process.env.PORT || 8000;
const MOBILE_APP_URL = process.env.MOBILE_APP_URL;
// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:5000",
  process.env.MOBILE_APP_URL,
  process.env.CHROME_EXTENSION_ORIGIN, // chrome-extension://<extension-id>
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Allow if origin is in the allowed list OR matches chrome-extension pattern
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('chrome-extension://')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// CRITICAL: Parse JSON bodies
app.use(express.json());

// routes
app.use('/api/auth', AuthRouter);
app.use('/api/coursera', CourseraRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notes', notesRouter);


app.get('/', (req, res) => {
  res.send('Hello from the !');
});

app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("http://localhost:8000");
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;