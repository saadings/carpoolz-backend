let User = require("../../models/users/userModel");
let Vendor = require("../../models/users/vendorModel");
let Store = require("../../models/store/storeModel");
const validationError = require("../../utils/error-handling/validationError");
const serverError = require("../../utils/error-handling/serverError");

exports.registerVendor = async (req, res) => {
  const { userName, cnic } = req.body;
  try {
    if (!userName || !cnic) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    let user = await User.findOne({
      userName: userName,
    });
    if (!user)
      return res.status(403).json({
        success: false,
        code: -2,
        message: "User is not registered.",
      });

    let vendor = await Vendor.findOne({
      userID: user._id,
    });

    if (vendor)
      return res.status(403).json({
        success: false,
        code: -3,
        message: "Vendor already registered.",
      });

    let newVendor = new Vendor({
      userID: user._id,
      cnic: cnic,
    });

    try {
      await newVendor.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Vendor created successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};

exports.registerStore = async (req, res) => {
  const {
    userName,
    storeName,
    address,
    longitude,
    latitude,
    contactNumber,
    timing,
  } = req.body;
  try {
    if (
      !userName ||
      !storeName ||
      !address ||
      !longitude ||
      !latitude ||
      !contactNumber ||
      !timing
    ) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    let user = await User.findOne({
      userName: userName,
    });
    if (!user)
      return res.status(403).json({
        success: false,
        code: -2,
        message: "User is not registered.",
      });

    let vendor = await Vendor.findOne({
      userID: user._id,
    });

    if (!vendor)
      return res.status(403).json({
        success: false,
        code: -3,
        message: "Vendor is not registered.",
      });

    let store = new Store({
      name: storeName,
      address: address,
      longitude: longitude,
      latitude: latitude,
      vendorId: vendor._id,
      contactNumber: contactNumber,
      timing: timing,
      rating: 0.0,
    });

    try {
      await store.save();
    } catch (error) {
      return res.status(400).json(validationError(error));
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Store created successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
