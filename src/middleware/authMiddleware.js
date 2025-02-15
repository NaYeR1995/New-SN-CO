import { verifyAccessToken, verifyRefreshToken } from "../Utils/jwtUtils.js";
import { refreshAccessToken } from "../Utils/refreshToken.js";

export const authenticate = async (req, res, next) => {
  let accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return refreshAccessToken(req, res, next); // Try to refresh token
  }
  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return refreshAccessToken(req, res, next); // Try to refresh token
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const SuperAdminCheck = async (req, res, next) => {
  const authUser = req.user;

  if (!authUser) {
    return res.status(401).json({ message: "Access token not found" });
  }

  if (authUser.role !== "SuperAdmin") {
    return res.status(403).json({ message: "Unauthorized Account" });
  }

  next(); 
};
