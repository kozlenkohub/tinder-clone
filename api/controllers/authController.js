import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
};

const validateSignupFields = ({ name, email, password, age, gender, genderPreference }) => {
  if (!name || !email || !password || !age || !gender || !genderPreference) {
    throw new Error('All fields are required');
  }
  if (age < 18 || age > 100) {
    throw new Error('Age must be between 18 and 100');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;

  try {
    validateSignupFields(req.body);

    const user = await User.create({ name, email, password, age, gender, genderPreference });
    const token = signToken(user._id);
    setCookie(res, token);

    res.status(201).json({ user, token, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', success: false });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    const token = signToken(user._id);
    setCookie(res, token);

    res.status(200).json({ user, token, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out', success: true });
};
