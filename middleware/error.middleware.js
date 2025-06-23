const errorMiddleware = (err, req, res, next) => {
    try {
        console.error("Error:", err);

        let statusCode = err.statusCode || 500;
        let message = err.message || 'Internal Server Error';

        if (err.name === 'CastError') {
            message = 'Resource not found. Invalid ID.';
            statusCode = 404;
        }

        if (err.code === 11000) {
            message = 'Duplicate field value entered.';
            statusCode = 400;
        }

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors || {}).map(val => val.message);
            message = errors.join(', ');
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error: message
        });

    } catch (internalError) {
        console.error("Internal error in error handler:", internalError);
        res.status(500).json({
            success: false,
            error: 'Something went wrong in error handling.'
        });
    }
};

export default errorMiddleware;
