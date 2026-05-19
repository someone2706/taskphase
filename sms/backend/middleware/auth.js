import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "superSecretKey";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}