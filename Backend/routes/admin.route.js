import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getAdminStats } from "../controllers/admin.controller.js";
import { getAllUsers, sendNotification, triggerDeadlineCheck } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// All admin routes require admin authentication
adminRouter.use(requireAdmin);

// GET /admin/stats (requireAdmin already applied via router.use)
adminRouter.get("/stats", getAdminStats);
adminRouter.get("/Users", getAllUsers);
adminRouter.post("/notifications", sendNotification);
adminRouter.post("/notifications/trigger", triggerDeadlineCheck);
export default adminRouter;
