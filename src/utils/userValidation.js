const { default: validator } = require("validator");

const isNameValid = (name) => /^[a-zA-Zא-ת]+$/.test(name);

const isEmailValid = (email) => validator.isEmail(email);

const isPasswordValid = (password) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password);

const isCityOfResidenceValid = (city) => city.length > 1;

const isYearOfBirthValid = (year) => new Date().getFullYear() - year >= 16;

const invalidEmailErrMsg = "Email is not valid";

const invalidPasswordErrMsg =
  "Passwords must contain at least six characters, at least one letter, one number and one capital letter";

const invalidNameErrMsg = "name must only include letters";

const invalidCityOfResidenceErrMsg = "City of residence is invalid";

const invalidYearOfBirthErrMsg = "Must be at least 16 years old";

module.exports = {
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isCityOfResidenceValid,
  isYearOfBirthValid,
  invalidEmailErrMsg,
  invalidPasswordErrMsg,
  invalidNameErrMsg,
  invalidCityOfResidenceErrMsg,
  invalidYearOfBirthErrMsg,
};
