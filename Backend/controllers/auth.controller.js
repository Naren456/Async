import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    const { email, password, name, cohortNo, role, semester, term } = req.body;

    if (
      !email ||
      !password ||
      !name ||
      cohortNo === undefined ||
      semester === undefined ||
      term === undefined
    ) {
      return res
        .status(400)
        .json({
          message:
            "All fields including cohortNo, semester & term are required",
        });
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        cohortNo,
        role: role || "STUDENT",
        semester,
        term,
      },
    });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cohortNo: user.cohortNo,
        semester: user.semester,
        term: user.term,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cohortNo: user.cohortNo,
        semester: user.semester,
        term: user.term,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE PROFILE (AUTH REQUIRED) ----------------
export const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "portsyncsecret"
    );
    const userId = decoded.userId;

    const { name, email, cohortNo, semester, term } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(cohortNo !== undefined ? { cohortNo: Number(cohortNo) } : {}),
        ...(semester !== undefined ? { semester: Number(semester) } : {}),
        ...(term !== undefined ? { term: Number(term) } : {}),
      },
    });

    return res.json({
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        cohortNo: updated.cohortNo,
        semester: updated.semester,
        term: updated.term,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// ----- Google Sign-in -----

export const googleSignin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID Token is required" });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, name, picture: profilePic } = payload;

    // 1. Check if user already exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // 2. If not, check if user exists with the same email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // 3. If email exists (e.g., from email/pass signup), link the Google account
        user = await prisma.user.update({
          where: { email },
          data: { googleId, profilePic: user.profilePic || profilePic },
        });
      } else {
        // 4. If no user exists at all, create a new one
        // IMPORTANT: cohortNo, semester, term are required by your schema/signup.
        // You must handle this. E.g., create them as null and
        // force user to update them on the frontend after first login.
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            profilePic,
            role: "STUDENT", // Default role
            // Set these to null or a default, and prompt user to fill them later
            cohortNo: null, 
            semester: null,
            term: null,
          },
        });
      }
    }

    // 5. User is found or created. Generate a token and send response.
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cohortNo: user.cohortNo,
        semester: user.semester,
        term: user.term,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during Google sign-in" });
  }
};