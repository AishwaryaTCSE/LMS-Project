class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}

class ValidationError extends ApiError {
    constructor(message = 'Validation Error', errors = []) {
        super(422, message);
        this.errors = errors;
    }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Set default values for error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const error = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Handle validation errors
    if (err.name === 'ValidationError') {
        error.message = 'Validation Error';
        error.errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error.field = field;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
    }

    res.status(statusCode).json(error);
};

module.exports = {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    errorHandler
};