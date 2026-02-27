import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Jwt token generation (accepts user object or id string)
export const generateToken = (userOrId) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    
    try{
        const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;
        if (!userId) {
            throw new Error('Invalid user identifier for token');
        }
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
        return token;
    }
    catch(error){
        console.error("Token generation error:", error);
        throw error;
    }
};