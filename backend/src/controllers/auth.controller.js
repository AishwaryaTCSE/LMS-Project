const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

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
    
    // 1. Check if email and password exist
    if (!email || !password) {
      return error(res, 'Please provide email and password', 400);
    }

    // 2. Find user by email and select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    // 3. Check if user exists
    if (!user) {
      console.log('Login failed: No user found with email:', email);
      return error(res, 'Incorrect email or password', 401);
    }

    // 4. Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', email);
      return error(res, 'Incorrect email or password', 401);
    }

    // 5. Check if user is active
    if (!user.isActive) {
      console.log('Login failed: User account is inactive:', email);
      return error(res, 'Your account has been deactivated. Please contact support.', 401);
    }

    // 6. If everything is ok, generate token
    const token = signToken(user);
    
    // 7. Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 8. Remove password from output
    user.password = undefined;

    // Prepare user data for response
    const userData = {
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
    };

    console.log('Login successful for user:', userData.email, 'Role:', userData.role);
    
    // Send response in the expected format
    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`, { error: err });
    error(res, 'Server error during login', 500);
  }
};
