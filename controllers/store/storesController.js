let serverError = require("../../utils/error-handling/serverError");
let validationError = require("../../utils/error-handling/validationError");
let Store = require("../../models/store/storeModel");
let Vendor = require("../../models/users/vendorModel");
let User = require("../../models/users/userModel");
let Deals = require("../../models/store/dealsModel");

exports.stores = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let user = await User.findOne({
      userName: userName,
    });

    if (!user)
      return res.status(400).json({
        success: false,
        code: -2,
        message: "User not registered.",
      });

    let vendor = await Vendor.findOne({
      userID: user._id,
    });

    if (!vendor)
      return res.status(400).json({
        success: false,
        code: -3,
        message: "Vendor not registered.",
      });

    let stores = await Store.find({
      vendorID: vendor._id,
    });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Stores retrieved successfully.",
      data: stores,
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};

exports.deals = async (req, res) => {
  try {
    const { storeID } = req.body;

    if (!storeID)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let deals = await Deals.find({
      storeID: storeID,
    });

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Deals retrieved successfully.",
      data: deals,
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};

exports.addDeals = async (req, res) => {
  try {
    const { storeID, title, description, price } = req.body;

    if (!storeID || !title || !description || !price)
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });

    let deals = new Deals({
      storeID: storeID,
      title: title,
      description: description,
      price: price,
    });

    try {
      await deals.save();
    } catch (error) {
      return res.status(500).json(validationError());
    }

    return res.status(201).json({
      success: true,
      code: 0,
      message: "Deal added successfully.",
      // data: deals,
    });
  } catch (err) {
    return res.status(500).json(serverError());
  }
};
