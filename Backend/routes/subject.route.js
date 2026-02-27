import express from "express";
import {
  getAllSubjects,
  getUserSubjects,
  createSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const subjectRouter = express.Router();

// ---------------- Public Routes ----------------
// Get all subjects
subjectRouter.get("/",authenticate ,getAllSubjects);

// Get subjects for a specific user (based on semester & term)
subjectRouter.get("/user/:userId", authenticate,getUserSubjects);

// Get single subject by ID
subjectRouter.get("/:subjectId",authenticate ,getSubjectById);

// ---------------- Admin Routes ----------------
// Create a new subject
subjectRouter.post("/",requireAdmin, createSubject);

// Update a subject
subjectRouter.put("/:subjectId",requireAdmin, updateSubject);

// Delete a subject
subjectRouter.delete("/:subjectId", requireAdmin,deleteSubject);

export default subjectRouter;
