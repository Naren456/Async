// routes/assignment.js
import express from "express";
import { createAssignment, deleteAssignment, getAssignmentsByCohortGrouped, toggleCompletion } from "../controllers/assignment.controller.js";
import { requireAdmin, authenticate } from "../middleware/auth.js";

const assignmentRouter = express.Router();

// POST /assignments (Admin only)
assignmentRouter.post("/", requireAdmin, createAssignment);

// GET /assignments/by-cohort/:cohortNo
assignmentRouter.get("/by-cohort/:cohortNo", authenticate, getAssignmentsByCohortGrouped);
assignmentRouter.delete('/:id',requireAdmin,deleteAssignment)
assignmentRouter.post("/toggle-completion",authenticate,toggleCompletion);
export default assignmentRouter;
