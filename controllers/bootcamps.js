const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc          Get All bootcamps
// @routes        GET /api/v1/bootcamps
// @access        Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFileds = ["select", "sort"];

  //Loop over removeFileds and delete them from reqQuery
  removeFileds.forEach((param) => delete reqQuery[param]);

  //Create quary string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators($gt,$gte,etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resourse
  query = Bootcamp.find(JSON.parse(queryStr));
  console.log(query, "queryquery");
  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //Executing query
  const bootcamps = await query;
  res
    .status(201)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
// @desc          Get Single bootcamp
// @routes        GET /api/v1/bootcamps/:id
// @access        Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});
// @desc          Create new bootcamp
// @routes        POST /api/v1/bootcamps
// @access        Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
// @desc          Update bootcamp
// @routes        PUT /api/v1/bootcamps
// @access        Public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});
// @desc         Delete bootcamp
// @routes        DELETE /api/v1/bootcamps
// @access        Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: {} });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
