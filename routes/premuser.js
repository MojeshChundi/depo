const express = require('express');
const AuthConttroller = require('../middleware/auth');
const premUserController = require('../controllers/premuser');
const router = express.Router();

router.get(
  '/user/premuser',
  AuthConttroller.Authenticate,
  premUserController.premUser
);

module.exports = router;
