const User = require('../models/user.model');
const { success, error } = require('../utils/response');
const { Parser } = require('json2csv');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs');

exports.getProfile = async (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    success(res, { id: _id, name, email, role });
  } catch (err) {
    console.error('Get Profile Error:', err);
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    success(res, users);
  } catch (err) {
    console.error('Get All Users Error:', err);
    next(err);
  }
};

exports.listStudents = async (req, res, next) => {
  try {
    const { q = '', status = 'all', page = 1, limit = 20 } = req.query;
    const filter = { role: 'student' };
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (status !== 'all') {
      filter.isActive = status === 'active';
    }
    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    success(res, { items: students, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    console.error('List Students Error:', err);
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: firstName, lastName, email, and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if user already exists
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Create student (password will be hashed by User model pre-save hook)
    const student = await User.create({ 
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(), 
      password, 
      role: 'student',
      isActive: true
    });

    // Remove password from response
    const studentData = student.toJSON();
    delete studentData.password;

    return res.status(201).json({ 
      success: true, 
      data: studentData,
      message: 'Student created successfully' 
    });
  } catch (err) {
    console.error('Create Student Error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    
    next(err);
  }
};

exports.exportStudents = async (req, res, next) => {
  try {
    const { q = '', status = 'all' } = req.query;
    const filter = { role: 'student' };
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (status !== 'all') filter.isActive = status === 'active';
    const students = await User.find(filter).lean();
    const fields = ['firstName', 'lastName', 'email', 'isActive', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(students);
    res.header('Content-Type', 'text/csv');
    res.attachment(`students_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('Export Students Error:', err);
    next(err);
  }
};

exports.updateMySettings = async (req, res, next) => {
  try {
    const { settings = {} } = req.body;
    const update = {};
    if (settings.timezone) update['settings.timezone'] = settings.timezone;
    if (settings.language) update['settings.language'] = settings.language;
    if (settings.notificationPrefs) {
      Object.keys(settings.notificationPrefs).forEach((k) => {
        update[`settings.notificationPrefs.${k}`] = settings.notificationPrefs[k];
      });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).select('-password');
    success(res, user);
  } catch (err) {
    console.error('Update My Settings Error:', err);
    next(err);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    success(res, user);
  } catch (err) {
    console.error('Get User Error:', err);
    next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { id } = req.params;
    const update = {};
    const allowed = ['firstName', 'lastName', 'email', 'phone', 'role', 'isActive', 'dateOfBirth'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    success(res, user);
  } catch (err) {
    console.error('Update User Error:', err);
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    success(res, { message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    next(err);
  }
};

// Bulk update users
exports.bulkUpdateUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: 'Validation failed' 
    });
  }

  try {
    const { userIds, updateData } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User IDs are required' 
      });
    }
    
    // Prevent updating your own role/status
    const currentUserId = req.user._id.toString();
    if (userIds.includes(currentUserId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot modify your own account in bulk operations' 
      });
    }
    
    // Prepare updates
    const updates = {};
    if (updateData.role) updates.role = updateData.role;
    if (updateData.status !== undefined) updates.isActive = updateData.status === 'active';
    
    // Add audit fields
    updates.updatedBy = req.user._id;
    updates.updatedAt = new Date();
    
    // Perform bulk update
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updates }
    );
    
    // Log the action
    console.log(`Bulk update by ${req.user._id}: Updated ${result.nModified} users`);
    
    success(res, { 
      message: `${result.nModified} users updated successfully`,
      updatedCount: result.nModified
    });
  } catch (err) {
    console.error('Bulk Update Error:', err);
    next(err);
  }
};

// Bulk delete users
exports.bulkDeleteUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: 'Validation failed' 
    });
  }

  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User IDs are required' 
      });
    }
    
    // Prevent deleting your own account
    const currentUserId = req.user._id.toString();
    if (userIds.includes(currentUserId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot delete your own account' 
      });
    }
    
    // Perform bulk delete
    const result = await User.deleteMany({ _id: { $in: userIds } });
    
    // Log the action
    console.log(`Bulk delete by ${req.user._id}: Deleted ${result.deletedCount} users`);
    
    success(res, { 
      message: `${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Bulk Delete Error:', err);
    next(err);
  }
};

// Get all users with filters and sorting
exports.getAllUsersWithFilters = async (req, res, next) => {
  try {
    const { 
      q = '', 
      status = 'all', 
      role = '', 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;
    
    const filter = {};
    
    // Search filter
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status !== 'all') {
      filter.isActive = status === 'active';
    }
    
    // Role filter
    if (role) {
      filter.role = role;
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endOfDay;
      }
    }
    
    // Sorting
    const sort = {};
    const validSortFields = ['firstName', 'lastName', 'email', 'role', 'createdAt', 'lastLogin'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute queries in parallel
    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean()
    ]);
    
    // Format response
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    success(res, { 
      items: users, 
      pagination: { 
        page: Number(page), 
        limit: Number(limit), 
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage
      } 
    });
  } catch (err) {
    console.error('Get Users Error:', err);
    next(err);
  }
};

// Export all users
exports.exportUsers = async (req, res, next) => {
  try {
    const { format = 'csv', ...filters } = req.query;
    
    // Apply the same filters as getAllUsersWithFilters
    const filter = {};
    
    if (filters.q) {
      filter.$or = [
        { firstName: { $regex: filters.q, $options: 'i' } },
        { lastName: { $regex: filters.q, $options: 'i' } },
        { email: { $regex: filters.q, $options: 'i' } }
      ];
    }
    
    if (filters.status && filters.status !== 'all') {
      filter.isActive = filters.status === 'active';
    }
    
    if (filters.role) {
      filter.role = filters.role;
    }
    
    // Get users with filters applied
    const users = await User.find(filter)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .lean();
    
    if (format.toLowerCase() === 'excel') {
      // Export to Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');
      
      // Add headers
      worksheet.columns = [
        { header: 'First Name', key: 'firstName', width: 20 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Last Login', key: 'lastLogin', width: 25 },
        { header: 'Created At', key: 'createdAt', width: 25 }
      ];
      
      // Add rows
      users.forEach(user => {
        worksheet.addRow({
          ...user,
          status: user.isActive ? 'Active' : 'Inactive',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
          createdAt: new Date(user.createdAt).toLocaleString()
        });
      });
      
      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=users-export-${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
      
    } else {
      // Default to CSV
      const fields = [
        { label: 'First Name', value: 'firstName' },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Email', value: 'email' },
        { label: 'Role', value: 'role' },
        { label: 'Status', value: row => row.isActive ? 'Active' : 'Inactive' },
        { 
          label: 'Last Login', 
          value: row => row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Never' 
        },
        { 
          label: 'Created At', 
          value: row => new Date(row.createdAt).toLocaleString() 
        }
      ];
      
      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(users);
      
      const filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(csv);
    }
    
    // Log the export action
    console.log(`User export by ${req.user._id}: Exported ${users.length} users to ${format.toUpperCase()}`);
    
  } catch (err) {
    console.error('Export Users Error:', err);
    next(err);
  }
};

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    // Get total counts by role
    const [
      totalUsers,
      activeUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      newUsersLast7Days,
      newUsersLast30Days
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ 
        createdAt: { 
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        } 
      }),
      User.countDocuments({ 
        createdAt: { 
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        } 
      })
    ]);
    
    // Get user growth data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          period: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          count: 1
        }
      },
      { $sort: { period: 1 } }
    ]);
    
    success(res, {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      newUsersLast7Days,
      newUsersLast30Days,
      userGrowth
    });
    
  } catch (err) {
    console.error('Get User Stats Error:', err);
    next(err);
  }
};