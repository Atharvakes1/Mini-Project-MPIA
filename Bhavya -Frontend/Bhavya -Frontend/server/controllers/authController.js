import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getDemoMode } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo_secret', { expiresIn: '30d' });
};

const COLLEGE_DOMAIN = process.env.COLLEGE_DOMAIN || 'glbitm.ac.in';

// ====== In-Memory Demo Store ======
const demoUsers = new Map();
let demoIdCounter = 1;

const createDemoUser = async ({ name, email, password, googleId, avatarUrl }) => {
  const id = `demo_${demoIdCounter++}`;
  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
  }
  const user = {
    _id: id,
    name,
    email,
    password: hashedPassword,
    googleId: googleId || null,
    avatarUrl: avatarUrl || '',
    role: 'student',
    isVerified: !!googleId,
    themePreference: 'cyber-dark',
    archivedChats: [],
  };
  demoUsers.set(email, user);
  demoUsers.set(id, user); // index by ID too
  return user;
};

const findDemoUserByEmail = (email) => demoUsers.get(email) || null;
const findDemoUserById = (id) => demoUsers.get(id) || null;

const matchDemoPassword = async (entered, hashed) => {
  if (!hashed) return false;
  return bcrypt.compare(entered, hashed);
};

// ====== Controllers ======

// @route  POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!email.endsWith(`@${COLLEGE_DOMAIN}`)) {
      return res.status(400).json({
        message: `Only @${COLLEGE_DOMAIN} email addresses are allowed`,
      });
    }

    if (getDemoMode()) {
      // Demo mode
      if (findDemoUserByEmail(email)) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await createDemoUser({ name, email, password });
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        themePreference: user.themePreference,
        token: generateToken(user._id),
      });
    }

    // Real DB mode
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      themePreference: user.themePreference,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (getDemoMode()) {
      const user = findDemoUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isMatch = await matchDemoPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        themePreference: user.themePreference,
        token: generateToken(user._id),
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      themePreference: user.themePreference,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    return res.status(501).json({
      message: 'Configure GOOGLE_CLIENT_ID in server/.env to enable Google OAuth',
    });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (getDemoMode()) {
      const user = findDemoUserById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/auth/verify
export const verifyStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId || studentId.trim().length < 4) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    if (getDemoMode()) {
      const user = findDemoUserById(req.user._id);
      if (user) user.isVerified = true;
      const { password, ...safeUser } = user || {};
      return res.json({ message: 'Verification successful', user: safeUser });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'Verification successful', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
