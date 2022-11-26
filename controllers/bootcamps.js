const Bootcamp = require("../models/Bootcamps");
// @desc          Get All bootcamps
// @routes        GET /api/v1/bootcamps
// @access        Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(201)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc          Get Single bootcamp
// @routes        GET /api/v1/bootcamps/:id
// @access        Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: `Bootcamp not found for the given ${req.params.id}`,
      });
    }
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc          Create new bootcamp
// @routes        POST /api/v1/bootcamps
// @access        Public
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc          Update bootcamp
// @routes        PUT /api/v1/bootcamps
// @access        Public
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: `Bootcamp not found for the given ${req.params.id}`,
      });
    }
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
// @desc         Delete bootcamp
// @routes        DELETE /api/v1/bootcamps
// @access        Public
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: `Bootcamp not found for the given ${req.params.id}`,
      });
    }
    res.status(201).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
