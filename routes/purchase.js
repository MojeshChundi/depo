const express = require("express");
const AuthConttroller = require("../middleware/auth");
const purchaseController = require("../controllers/purchase");
const resetpasswordController = require("../controllers/forgotpwd");
const router = express.Router();

//RAZORPAY PAYMENT

router.get(
  "/user/purchasePremium",
  AuthConttroller.Authenticate,
  purchaseController.purchasePremium
);

//  UPDATE TRANSACTION STATUS
router.post(
  "/user/status",
  AuthConttroller.Authenticate,
  purchaseController.updateTrasactionStatus
);

module.exports = router;
