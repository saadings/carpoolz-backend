const serverError = require("../../utils/error-handling/serverError");

exports.socketEmit = async (req, res) => {
  const io = req.app.locals.io;
  const { data, event } = req.body;

  try {
    if (!data || !event) {
      return res.status(400).json({
        success: false,
        code: -1,
        message: "Please provide all the required fields.",
      });
    }

    io.emit(event, data);
    return res.status(200).json({
      success: true,
      code: 1,
      message: "Socket event emitted successfully.",
    });
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
