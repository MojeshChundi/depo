const express = require("express");
const router = express.Router();
const resetpasswordController = require("../controllers/forgotpwd");

router.get(
  "/updatepassword/:resetpasswordid",
  resetpasswordController.updatepassword
);

router.get("/resetpassword/:id", resetpasswordController.resetpassword);

router.post("/pwd", resetpasswordController.forgotpassword);

module.exports = router;
