import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const determineCohort = (email) => {
  const normalizedEmail = (email || "").toLowerCase().trim();
  if (process.env.NODE_ENV !== "production") {
    console.log(`Determining cohort for email: ${normalizedEmail}`);
  }
  // Whitelist for Chrome Web Store Reviewer
  if (normalizedEmail === "async.test.user01@gmail.com") {
    return 4;
  }
  if (normalizedEmail.endsWith("@ds.study.iitm.ac.in")) {
    // IITM DS students currently map to cohort 6 (3rd sem equivalent) - cohort 2025 doesn't exist in DB
    // TODO: create dedicated IITM cohort when curriculum diverges
    return 6;
  }

  if (!normalizedEmail.endsWith("@online.bits-pilani.ac.in")) {
    if (process.env.NODE_ENV !== "production") console.log(`Domain not authorized for email: ${normalizedEmail}`);
    return null;
  }
  // Extract year prefix - BITS WILP emails are like 2024xx... or 2025xx...
  const localPart = normalizedEmail.split("@")[0];
  if (localPart.startsWith("2024")) {
    return 4;
  }
  if (localPart.startsWith("2025")) {
    return 6;
  }
  // Support other batches (f2023, etc.) - map to closest cohort or reject gracefully
  if (process.env.NODE_ENV !== "production") console.log(`Year not mapped for email: ${normalizedEmail}`);
  return null;
};

export const signupUser = async (userData) => {
  const { email, password, name, semester, term } = userData;
  // SECURITY: ignore client-supplied role - always create as STUDENT
  const normalizedEmail = (email || "").toLowerCase().trim();

  if (!password || password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw { status: 400, message: "Invalid email format" };
  }

  const assignedCohort = determineCohort(normalizedEmail);
  if (!assignedCohort) {
    throw { status: 400, message: "Email domain or year not authorized. Use BITS Pilani or IITM student email." };
  }

  // Validate cohort exists in DB
  const cohortExists = await prisma.cohort.findUnique({ where: { cohortNo: assignedCohort } });
  if (!cohortExists) {
    throw { status: 500, message: "Cohort configuration error - please contact admin" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw { status: 400, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: (name || "").trim(),
      password: hashedPassword,
      cohortNo: assignedCohort,
      role: "STUDENT",
      semester: semester !== undefined ? Number(semester) : 1,
      term: term !== undefined ? Number(term) : 1,
    },
  });

  const token = generateToken(user);
  return { user, token };
};

export const signinUser = async (email, password) => {
  const normalizedEmail = (email || "").toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw { status: 400, message: "Invalid credentials" };

  if (!user.password) {
    throw { status: 400, message: "This account uses Google Sign-In. Please sign in with Google." };
  }

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

  const { sub: googleId, email: rawEmail, name, picture: profilePic } = payload;
  const email = (rawEmail || "").toLowerCase().trim();
  if (process.env.NODE_ENV !== "production") console.log(`Google Sign-In successful for: ${email} (ID: ${googleId})`);

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Link Google ID - handle race via update with unique constraint
      try {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, profilePic: user.profilePic || profilePic },
        });
      } catch (e) {
        // If googleId already taken by concurrent request, refetch by googleId
        if (e.code === 'P2002') {
          user = await prisma.user.findUnique({ where: { googleId } });
        } else throw e;
      }
    } else {
      const assignedCohort = determineCohort(email);
      if (!assignedCohort) {
        throw { status: 403, message: "Access denied. Only authorized BITS Pilani or IITM student emails are allowed for new registration." };
      }
      const cohortExists = await prisma.cohort.findUnique({ where: { cohortNo: assignedCohort } });
      if (!cohortExists) {
        throw { status: 500, message: "Cohort configuration error - please contact admin" };
      }

      try {
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
      } catch (e) {
        // Race: another request created same email concurrently
        if (e.code === 'P2002') {
          user = await prisma.user.findUnique({ where: { email } });
          if (user && !user.googleId) {
            user = await prisma.user.update({ where: { email }, data: { googleId } });
          }
        } else throw e;
      }
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
  const data = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) throw { status: 400, message: "Invalid name" };
    data.name = name.trim();
  }
  if (email !== undefined) {
    const normalizedEmail = String(email).toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw { status: 400, message: "Invalid email format" };
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing && existing.id !== userId) throw { status: 400, message: "Email already in use" };
    const cohortCheck = determineCohort(normalizedEmail);
    if (!cohortCheck) throw { status: 400, message: "Email domain not authorized" };
    data.email = normalizedEmail;
  }
  if (cohortNo !== undefined) {
    if (cohortNo === null) data.cohortNo = null;
    else {
      const num = Number(cohortNo);
      if (isNaN(num)) throw { status: 400, message: "Invalid cohortNo" };
      const exists = await prisma.cohort.findUnique({ where: { cohortNo: num } });
      if (!exists) throw { status: 400, message: "Cohort does not exist" };
      data.cohortNo = num;
    }
  }
  if (semester !== undefined) {
    if (semester === null) data.semester = null;
    else {
      const num = Number(semester);
      if (isNaN(num) || num < 1 || num > 8) throw { status: 400, message: "Invalid semester (1-8)" };
      data.semester = num;
    }
  }
  if (term !== undefined) {
    if (term === null) data.term = null;
    else {
      const num = Number(term);
      if (isNaN(num) || num < 1 || num > 4) throw { status: 400, message: "Invalid term (1-4)" };
      data.term = num;
    }
  }
  if (cgr !== undefined) {
    if (cgr === null) data.cgr = null;
    else {
      const num = Number(cgr);
      if (isNaN(num) || num < 0 || num > 10) throw { status: 400, message: "Invalid CGR (0-10)" };
      data.cgr = num;
    }
  }
  if (notificationTone !== undefined) {
    const allowed = ['strict','funny','friendly_romantic','bro','friendly', null];
    if (!allowed.includes(notificationTone)) throw { status: 400, message: "Invalid notification tone" };
    data.notificationTone = notificationTone;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return updated;
};

export const updateUserPushToken = async (userId, pushToken) => {
  await prisma.user.update({
    where: { id: userId },
    data: { pushToken },
  });
};