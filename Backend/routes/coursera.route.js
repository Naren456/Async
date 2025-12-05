import express from "express";

import { getCourseraAssignments } from "../controllers/coursera.controller.js";
import { authenticate } from "../middleware/auth.js";

const CourseraRouter = express.Router();


CourseraRouter.get("/assignments",getCourseraAssignments);

export default CourseraRouter;
