var { expressjwt: jwt } = require("express-jwt");

// req.user
export const requireSignin = jwt({
  // secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
