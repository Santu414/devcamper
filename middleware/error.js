const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  //Log to the dev for console
  console.log(err);
  let error = { ...err };

  //Mongoose bad Object ID
  if (err.name === "CastError") {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //Mangoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    succcess: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
