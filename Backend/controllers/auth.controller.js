import * as authService from "../services/auth.service.js";
import { sendPushNotification } from "../utils/notification.js";
import prisma from "../config/db.js"; // Keep for sendTestNotification if needed, or move to service

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    const { email, password, name, semester, term } = req.body;

    if (!email || !password || !name || semester === undefined || term === undefined) {
      return res.status(400).json({ message: "All fields including semester & term are required" });
    }

    const result = await authService.signupUser(req.body);
    
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const result = await authService.signinUser(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.json(result);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

// ---------------- UPDATE PROFILE (AUTH REQUIRED) ----------------
export const updateProfile = async (req, res) => {
  try {
    // req.user is set by authenticate middleware (userId)
    const userId = req.user;
    
    const updatedUser = await authService.updateUserProfile(userId, req.body);

    return res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error updating profile" });
  }
};

// ----- Google Sign-in -----
export const googleSignin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID Token is required" });
    }

    const result = await authService.googleSigninUser(idToken);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error during Google sign-in" });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user;
    const user = await authService.getUserProfile(userId);
    res.json({ user });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error fetching user profile" });
  }
};

export const updatePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;
    const userId = req.user;

    if (!pushToken) {
      return res.status(400).json({ message: "Push token is required" });
    }

    await authService.updateUserPushToken(userId, pushToken);

    res.status(200).json({ message: "Push token updated successfully" });
  } catch (error) {
    console.error("Error updating push token:", error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Server error updating push token" });
  }
};

export const sendTestNotification = async (req, res) => {
  try {
    const userId = req.user;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.pushToken) {
      return res.status(404).json({ message: "User or push token not found" });
    }

    await sendPushNotification(user.pushToken, "This is a test notification from ASync!");
    res.status(200).json({ message: "Test notification sent" });
  } catch (error) {
    console.error("Error sending test notification:", error);
    res.status(500).json({ message: "Server error sending notification" });
  }
};