const {
  isYearOfBirthValid,
  isCityOfResidenceValid,
  isNameValid,
  isPasswordValid,
  isEmailValid,
  invalidEmailErrMsg,
  invalidNameErrMsg,
  invalidPasswordErrMsg,
  invalidCityOfResidenceErrMsg,
  invalidYearOfBirthErrMsg,
} = require("../utils/userValidation");

const areNewUserDetailsValid = (req, res, next) => {
  try {
    const {
      //   email,
      password,
      firstName,
      lastName,
      cityOfResidence,
      yearOfBirth,
    } = req.body;
    req.userDetails = {
      //   email,
      password,
      firstName,
      lastName,
      cityOfResidence,
      yearOfBirth,
    };

    // if (!!email && !isEmailValid(email)) throw new Error(invalidEmailErrMsg);
    if (!!password && !isPasswordValid(password))
      throw new Error(invalidPasswordErrMsg);
    if (!!firstName && !isNameValid(firstName))
      throw new Error(invalidNameErrMsg);
    if (!!lastName && !isNameValid(lastName))
      throw new Error(invalidNameErrMsg);
    if (!!cityOfResidence && !isCityOfResidenceValid(cityOfResidence))
      throw new Error(invalidCityOfResidenceErrMsg);
    if (!!yearOfBirth && !isYearOfBirthValid(yearOfBirth))
      throw new Error(invalidYearOfBirthErrMsg);

    next();
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: err.message || err,
    });
  }
};

module.exports = areNewUserDetailsValid;
