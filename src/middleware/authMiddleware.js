import { verifyAccessToken, verifyRefreshToken } from "../Utils/authUtils.js";
import { refreshAccessToken } from "../Utils/refreshToken.js";

export const authenticate = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "You Need to Login" });
    }

    try {

      const newAccessToken = await refreshAccessToken(req, res);
      if (!newAccessToken) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      token = newAccessToken;
    } catch (error) {
      return res.status(401).json({ message: "Access Denied" });
    }
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const SuperAdminCheck = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "You Need to Login" });
    }

    try {
      const newAccessToken = await refreshAccessToken(req, res);
      if (!newAccessToken) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      token = newAccessToken;
    } catch (error) {
      return res.status(401).json({ message: "Access Denied" });
    }
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    if (decoded.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this route" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};
