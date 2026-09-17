import express from "express";
import { getLandingStats, savePushSubscription } from "../controllers/public.controller.js";

const publicRouter = express.Router();

// GET /api/public/stats
publicRouter.get("/stats", getLandingStats);
publicRouter.post("/push-subscriptions", savePushSubscription);

export default publicRouter;
