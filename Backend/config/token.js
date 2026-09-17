import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Jwt token generation (accepts user object or id string)
// 90 days persistent login for web as requested
export const generateToken = (userOrId, expiresIn = "90d") => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (JWT_SECRET.length < 32 && process.env.NODE_ENV === "production") {
        console.warn("WARNING: JWT_SECRET is too short, use at least 32 random bytes");
    }
    
    try{
        const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;
        const role = typeof userOrId === 'object' ? userOrId?.role : undefined;
        if (!userId) {
            throw new Error('Invalid user identifier for token');
        }
        const payload = role ? { userId, role } : { userId };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
        return token;
    }
    catch(error){
        console.error("Token generation error:", error);
        throw error;
    }
};