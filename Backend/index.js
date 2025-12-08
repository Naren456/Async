import express from 'express';
import cors from 'cors';
import multer from 'multer';

import dotenv from 'dotenv';
import AuthRouter from './routes/auth.route.js';
import CourseraRouter from './routes/coursera.route.js';
import subjectRouter from './routes/subject.route.js';
import assignmentRouter from './routes/assignment.route.js';
import adminRouter from './routes/admin.route.js';
import notesRouter from './routes/note.route.js';
import './jobs/assignmentCleanUp.js'; 
import './jobs/syncAssignment.js'
import scheduleDeadlineNotifications from './cron/scheduler.js';

scheduleDeadlineNotifications();
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "*", // replace with your frontend URL
  credentials: true // allow cookies to be sent
}));
app.use(express.json());


// routes
app.use('/api/auth', AuthRouter);
app.use('/api/coursera',CourseraRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notes', notesRouter);

// test route

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 8000");
});