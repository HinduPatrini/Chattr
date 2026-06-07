 const errorHandler = (err, req, res, next) => {
  console.error("Error handler caught error:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;
