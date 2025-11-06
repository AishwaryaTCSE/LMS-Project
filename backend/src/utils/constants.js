const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student'
});

const STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
});

module.exports = { USER_ROLES, STATUS };
