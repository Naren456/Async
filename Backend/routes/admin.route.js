import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getAdminStats } from "../controllers/admin.controller.js";
import { getAllUsers, sendNotification, triggerDeadlineCheck } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// All admin routes require admin authentication
adminRouter.use(requireAdmin);

// GET /admin/stats
adminRouter.get("/stats",requireAdmin, getAdminStats);
adminRouter.get("/Users",requireAdmin,getAllUsers);
adminRouter.post("/notifications", requireAdmin, sendNotification);
adminRouter.post("/notifications/trigger", requireAdmin, triggerDeadlineCheck);
export default adminRouter;
