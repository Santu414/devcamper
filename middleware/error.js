const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  //Log to the dev for console
  console.log(err.stack.red);
  let error = { ...err };
  //Mongoose bad Object ID

  if (err.name === "CastError") {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  res.status(error.statusCode || 500).json({
    succcess: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
