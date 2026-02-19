import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "Unauthorized: No token provided" });
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", token_decode);

        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        console.log("Authorization successful, proceeding to next middleware.");
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
