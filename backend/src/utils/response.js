// utils/response.js

const success = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

const error = (res, message = 'Error', status = 500) => {
  return res.status(status).json({ success: false, message });
};

module.exports = { success, error };
