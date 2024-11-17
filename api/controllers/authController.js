// controllers/authController.js

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);
};

// Validate signup fields
const validateSignupFields = (data) => {
  const { name, email, password, phone, gender } = data;

  if (!name || !email || !password || !phone || !gender) {
    throw new Error('All required fields must be provided.');
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format.');
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Validate gender
  const allowedGenders = ['male', 'female', 'other'];
  if (!allowedGenders.includes(gender.toLowerCase())) {
    throw new Error('Invalid gender.');
  }

  // Validate phone number
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Invalid phone number.');
  }
};

// Signup controller
export const signup = async (req, res) => {
  try {
    validateSignupFields(req.body);

    const { name, email, password, phone, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.', success: false });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
    });

    // Sign JWT token
    const token = signToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    res.status(201).json({ user, token, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.', success: false });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Validate user and password
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.', success: false });
    }

    // Sign JWT token
    const token = signToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    res.status(200).json({ user, token, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', success: false });
  }
};

// Logout controller
export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully.', success: true });
};

// Request Password Reset controller
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.', success: false });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/reset-password/${resetToken}`;

    // Send email
    const message = `Forgot your password? Reset it here: ${resetURL}\nIf you didn't request this, please ignore.`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({ message: 'Password reset email sent.', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset.', success: false });
  }
};

// Reset Password controller
export const resetPassword = async (req, res) => {
  try {
    // Hash token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user by token and check if token is not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.', success: false });
    }

    // Update password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Sign JWT token
    const token = signToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    res.status(200).json({ user, token, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', success: false });
  }
};
