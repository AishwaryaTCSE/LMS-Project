const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { success, error } = require('../utils/response');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, password, confirmPassword, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return error(res, 'First name, last name, email, and passwords are required', 400);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return error(res, 'Passwords do not match', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(res, 'Please provide a valid email address', 400);
    }

    // Check if user already exists
    const emailNormalized = email.toLowerCase();
    const exists = await User.findOne({ email: emailNormalized });
    if (exists) return error(res, 'Email already in use', 400);

    // Validate role
    const allowedRoles = ['student', 'teacher', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email: emailNormalized,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      password,
      role: userRole,
    });

    // Generate JWT token
    const token = signToken(user);
    
    // Return success response
    success(
      res,
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        },
        token
      },
      201
    );
  } catch (err) {
    logger.error(`Registration error: ${err.message}`, { error: err });
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return error(res, messages.join(', '), 400);
    }
    
    // Handle duplicate key error (email)
    if (err.code === 11000) {
      return error(res, 'Email already in use', 400);
    }
    
    error(res, 'Server error during registration', 500);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const emailNormalized = email.toLowerCase();
    const user = await User.findOne({ email: emailNormalized });
    if (!user) return error(res, 'Invalid credentials', 401);

    const match = await user.comparePassword(password);
    if (!match) return error(res, 'Invalid credentials', 401);

    const token = signToken(user);
    success(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`, { error: err });
    error(res, 'Server error during login', 500);
  }
};
