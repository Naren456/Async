import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  // Support both Authorization header and httpOnly cookie
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }
  
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId; // attach user to request
    req.userRole = decoded.role; // if present
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin role check middleware - compose after authenticate to avoid double verification
export const requireAdmin = async (req, res, next) => {
  // First authenticate if not already done
  if (!req.user) {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    else if (req.cookies?.token) token = req.cookies.token;
    
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.userId;
      req.userRole = decoded.role;
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
  
  try {
    // Use role from token if available to avoid DB hit, otherwise fetch
    let role = req.userRole;
    if (!role) {
      const user = await prisma.user.findUnique({
        where: { id: req.user },
        select: { role: true }
      });
      role = user?.role;
    }

    if (!role || role !== 'TEACHER') {
      // Fallback DB check in case token role is stale
      if (req.userRole) {
        const fresh = await prisma.user.findUnique({ where: { id: req.user }, select: { role: true } });
        if (!fresh || fresh.role !== 'TEACHER') return res.status(403).json({ message: "Admin access required" });
      } else {
        return res.status(403).json({ message: "Admin access required" });
      }
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Error checking admin role" });
  }
};
