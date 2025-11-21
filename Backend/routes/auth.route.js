import { signin,signup, updateProfile } from "../controllers/auth.controller.js";
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { googleSignin ,getMe} from "../controllers/auth.controller.js";
const AuthRouter = express.Router();

// --- ROUTES ---
AuthRouter.post("/signup", signup);
AuthRouter.post("/signin", signin);
AuthRouter.post("/google", googleSignin);
AuthRouter.put("/me", authenticate, updateProfile);
AuthRouter.get("/me", authenticate, getMe);
export default AuthRouter;