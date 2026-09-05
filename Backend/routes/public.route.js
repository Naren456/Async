import express from "express";
import { getLandingStats } from "../controllers/public.controller.js";

const publicRouter = express.Router();

// GET /api/public/stats
publicRouter.get("/stats", getLandingStats);

export default publicRouter;
