import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided or invalid token format." });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired." });
      }
      return res.status(403).json({ message: "Failed to authenticate token." });
    }
    // If token is valid, save decoded payload to request for use in other routes
    req.userId = decoded.id;
    req.isAdmin = decoded.is_admin;
    next(); // Proceed to the next middleware/route handler
  });
}; 