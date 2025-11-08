// utils/response.js

const success = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

const error = (res, message = 'Error', status = 500) => {
  return res.status(status).json({ success: false, message });
};

// Compatibility classes for controllers that instantiate response objects
class SuccessResponse {
  constructor(data, message = 'Success', status = 200) {
    this.data = data;
    this.message = message;
    this.status = status;
  }

  send(res) {
    return res.status(this.status).json({ success: true, data: this.data, message: this.message });
  }
}

class ErrorResponse {
  constructor(message = 'Error', status = 500) {
    this.message = message;
    this.status = status;
  }

  send(res) {
    return res.status(this.status).json({ success: false, message: this.message });
  }
}

module.exports = { success, error, SuccessResponse, ErrorResponse };
