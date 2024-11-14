import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return res.status(401).json({ message: 'You are not logged in', success: false });
  }

  const token = req.cookies.jwt;

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'User not found', success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', success: false });
    }
    return res.status(401).json({ message: 'Invalid token', success: false });
  }
};
