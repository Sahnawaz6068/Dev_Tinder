const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter first name or lastname");
  }
  // else if(!firstName.length>=4||!firstName.length<50){
  //     throw new Error("Enter valid Name, name is too short or too long")
  // }
  else if (!validator.isEmail(email)) {
    throw new Error("Enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password");
  }
};

module.exports = {
  validateSignupData,
};
