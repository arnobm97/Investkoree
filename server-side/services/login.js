import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import generateToken from '../utils/jwtUtils.js';
import verifyToken from '../utils/authMiddleware.js';

async function login(email, password) {
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new Error("User not found");
        }

        const isPassValid = await bcrypt.compare(password, existingUser.password);
        if (!isPassValid) {
            throw new Error("Incorrect password");
        }

        // Generate and return token if user is authenticated
        const token = generateToken(existingUser);
        return token; // Ensure this is returned

    } catch (error) {
        console.error("Login error:", error.message); // Log detailed error for debugging
        throw new Error("Invalid credentials");
    }
}

async function refreshToken(oldToken) {
    try {
        const decodedToken = verifyToken(oldToken);
        const user = await User.findById(decodedToken._id); // Add `await` to retrieve the user correctly

        if (!user) {
            throw new Error("User not found");
        }

        // Generate a new token and return it
        const newToken = generateToken(user);
        return newToken;

    } catch (error) {
        console.error("Refresh token error:", error.message); // Log detailed error for debugging
        throw new Error("Invalid token");
    }
}

export default { login, refreshToken };