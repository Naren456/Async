import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const determineCohort = (email) => {
  console.log(`Determining cohort for email: ${email}`);
  // Whitelist for Chrome Web Store Reviewer
  if (email === "async.test.user01@gmail.com") {
    return 4;
  }
  if (email.endsWith("@ds.study.iitm.ac.in")) {
    return 2025;
  }

  if (!email.endsWith("@online.bits-pilani.ac.in")) {
    console.log(`Domain not authorized for email: ${email}`);
    return null;
  }
  if (email.startsWith("2024")) {
    return 4;
  }
  if (email.startsWith("2025")) {
    return 6;
  }

  return null;
};

export const signupUser = async (userData) => {
  const { email, password, name, role, semester, term } = userData;

  const assignedCohort = determineCohort(email);
  if (!assignedCohort) {
    throw { status: 400, message: "Email domain or year not authorized. Use BITS Pilani or IITM student email." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw { status: 400, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      cohortNo: assignedCohort,
      role: role || "STUDENT",
      semester,
      term,
    },
  });

  const token = generateToken(user);
  return { user, token };
};

export const signinUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 400, message: "Invalid credentials" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 400, message: "Invalid credentials" };

  const token = generateToken(user);
  return { user, token };
};

export const googleSigninUser = async (idToken) => {
  // Support multiple explicit client IDs across web, android preview builds, and extension platforms
  const ticket = await client.verifyIdToken({
    idToken,
    audience: [
      process.env.GOOGLE_CLIENT_ID, // Web Client ID
      process.env.ANDROID_CLIENT_ID, // Android Client ID
      process.env.IOS_CLIENT_ID, // iOS Client ID
      process.env.CHROME_EXTENSION_CLIENT_ID, // Chrome Extension Client ID
    ].filter(Boolean), // Cleans out any unassigned or undefined environment fields safely
  });
  
  const payload = ticket.getPayload();

  // Safety Guard: explicit check to capture audience mismatch failures gracefully
  if (!payload) {
    console.error("No payload found in Google token: Audience verification rejected.");
    throw { status: 401, message: "Invalid Google token or unauthorized application audience signature match." };
  }

  const { sub: googleId, email, name, picture: profilePic } = payload;
  console.log(`Google Sign-In successful for: ${email} (ID: ${googleId})`);

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId, profilePic: user.profilePic || profilePic },
      });
    } else {
      const assignedCohort = determineCohort(email);
      if (!assignedCohort) {
        throw { status: 403, message: "Access denied. Only authorized BITS Pilani or IITM student emails are allowed for new registration." };
      }

      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          profilePic,
          role: "STUDENT",
          cohortNo: assignedCohort,
          semester: 1,
          term: 1,
        },
      });
    }
  }

  const token = generateToken(user);
  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      cohortNo: true,
      semester: true,
      term: true,
      cgr: true,
      profilePic: true,
      notificationTone: true,
    },
  });

  if (!user) throw { status: 404, message: "User not found" };
  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const { name, email, cohortNo, semester, term, cgr, notificationTone } = updates;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(cohortNo !== undefined ? { cohortNo: cohortNo === null ? null : Number(cohortNo) } : {}),
      ...(semester !== undefined ? { semester: semester === null ? null : Number(semester) } : {}),
      ...(term !== undefined ? { term: term === null ? null : Number(term) } : {}),
      ...(cgr !== undefined ? { cgr: cgr === null ? null : Number(cgr) } : {}),
      ...(notificationTone !== undefined ? { notificationTone } : {}),
    },
  });

  return updated;
};

export const updateUserPushToken = async (userId, pushToken) => {
  await prisma.user.update({
    where: { id: userId },
    data: { pushToken },
  });
};