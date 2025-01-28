import { verifyAccessToken } from "../Utils/authUtils.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const SuperAdminCheck = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
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
