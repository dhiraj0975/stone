const ErrorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errName: err.name || "Error",
  });
};

export default ErrorHandler;
