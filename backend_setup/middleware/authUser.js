const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.body?.token || req.header('Authorization')?.replace("Bearer " , "");

    // console.log("Token: ", token);

    if (!token) {
      return res.redirect("/login");
    } else {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

      req.user = decoded;
      req.token = token;

      next();
    }
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

module.exports = { authenticateUser };
