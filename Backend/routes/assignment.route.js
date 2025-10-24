// routes/assignment.js
import express from "express";
import { createAssignment, deleteAssignment, getAssignmentsByCohortGrouped } from "../controllers/assignment.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const assignmentRouter = express.Router();

// POST /assignments (Admin only)
assignmentRouter.post("/", requireAdmin, createAssignment);

// GET /assignments/by-cohort/:cohortNo
assignmentRouter.get("/by-cohort/:cohortNo", getAssignmentsByCohortGrouped);
assignmentRouter.delete('/:id',requireAdmin,deleteAssignment)
export default assignmentRouter;
