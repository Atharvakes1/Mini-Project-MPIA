import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoMode } from '../config/db.js';

// In-memory user lookup for demo mode (uses same map from authController)
// We re-decode the token and trust the ID stored within it for demo mode.

// Protect routes — verify JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');

      if (getDemoMode()) {
        // In demo mode, just attach the decoded ID as the user object
        req.user = { _id: decoded.id, role: 'student' };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only guard
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};
