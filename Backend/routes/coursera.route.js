import express from "express";

import { getCourseraAssignments } from "../controllers/coursera.controller.js";
import { authenticate } from "../middleware/auth.js";

const CourseraRouter = express.Router();

// Require auth - was unauthenticated before (H2)
CourseraRouter.get("/assignments", authenticate, getCourseraAssignments);

export default CourseraRouter;
