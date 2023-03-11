module.exports = (error) => {
  if (error) {
    var validationErrors = [];
    for (field in error.errors) {
      validationErrors.push(error.errors[field].message);
    }
    return {
      success: false,
      code: -1,
      message: "Validation failed in updating database.",
      errors: validationErrors,
    };
  }
};
