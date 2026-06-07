 import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "chattr_fallback_jwt_secret_key_9988776655";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn }
  );
};

export default generateToken;
