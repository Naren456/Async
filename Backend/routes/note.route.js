// Backend/routes/notes.route.js
import express from "express";
import { createNoteWithUpload, deleteNote } from "../controllers/note.controller.js";
import upload from "../middleware/upload.js"; // Import multer middleware
import { requireAdmin } from "../middleware/auth.js"; // Import admin auth middleware

const notesRouter = express.Router();

// POST /api/notes/upload - Requires admin auth and handles single file upload named 'pdf'
notesRouter.post("/upload", requireAdmin, upload.single('pdf'), createNoteWithUpload);

// DELETE /api/notes/:noteId - Requires admin auth
notesRouter.delete("/:noteId", requireAdmin, deleteNote);


export default notesRouter;