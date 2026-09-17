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
import publicRouter from './routes/public.route.js';
import scheduler from './cron/scheduler.js';
import './jobs/assignmentCleanUp.js'; 
import './jobs/syncAssignment.js';

// Disable cron duplication on Vercel serverless - use Vercel Cron via vercel.json instead
if (process.env.VERCEL === "1" && process.env.ENABLE_CRON !== "true") {
  console.log("Cron jobs disabled on Vercel (use vercel.json crons) - set ENABLE_CRON=true to force");
} else {
  scheduler();
}



const app = express();
const PORT = process.env.PORT || 8000;
const MOBILE_APP_URL = process.env.MOBILE_APP_URL;
// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:5000",
  "http://localhost:5173",
  "https://async-0.vercel.app",
  process.env.MOBILE_APP_URL,
  process.env.FRONTEND_URL,
  process.env.LANDING_PAGE_URL,
  process.env.CHROME_EXTENSION_ORIGIN, // chrome-extension://<extension-id>
].filter(Boolean); // Remove undefined values

// Cookie parsing for JWT cookie auth (lightweight manual parse, avoid extra dep)
app.use((req, _res, next) => {
  if (!req.cookies) {
    req.cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      cookieHeader.split(';').forEach(c => {
        const [k, ...v] = c.trim().split('=');
        req.cookies[k] = decodeURIComponent(v.join('='));
      });
    }
  }
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // SECURITY FIX: only allow the whitelisted extension origin, not any chrome-extension://
    const isAllowedExtension = process.env.CHROME_EXTENSION_ORIGIN && origin === process.env.CHROME_EXTENSION_ORIGIN;
    if (allowedOrigins.indexOf(origin) !== -1 || isAllowedExtension) {
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
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', AuthRouter);
app.use('/api/coursera', CourseraRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notes', notesRouter);
app.use('/api/public', publicRouter);


app.get('/', (req, res) => {
  res.send('Hello from the !');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") console.error("❌ Global Error Handler:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS blocked: origin not allowed' });
  }
  const status = err.status || 500;
  const message = status === 500 && process.env.NODE_ENV === "production" ? "Internal Server Error" : (err.message || "Internal Server Error");
  res.status(status).json({ message });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("http://localhost:8000");
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
