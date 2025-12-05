import { 
  signin, 
  signup, 
  updateProfile, 
  googleSignin, 
  getMe, 
  updatePushToken, 
  sendTestNotification 
} from "../controllers/auth.controller.js";
import express from "express";
import { authenticate } from "../middleware/auth.js";
const AuthRouter = express.Router();


AuthRouter.post("/signup", signup);
AuthRouter.post("/signin", signin);
AuthRouter.post("/google", googleSignin);
AuthRouter.put("/me", authenticate, updateProfile);
AuthRouter.get("/me", authenticate, getMe);
AuthRouter.put("/push-token", authenticate, updatePushToken);
AuthRouter.post("/test-notification", authenticate, sendTestNotification);
export default AuthRouter;