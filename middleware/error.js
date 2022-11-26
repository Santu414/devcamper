const errorHandler = (err, req, res, next) => {
  //Log to the dev for console
  console.log(err.stack.red);
  res.status(err.statusCode || 500).json({
    succcess: false,
    error: err.message || "Server Error",
  });
};

module.exports = errorHandler;
