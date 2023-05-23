const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.postAddUser = async (req, res, next) => {
  console.log("user");
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // scrpting the password
    bcrypt.hash(password, 10, (err, hash) => {
      const data = {
        name: name,
        email: email,
        password: hash,
      };
      User.create(data);
      res.status(201).json({ data: data });
    });
  } catch (err) {
    console.log(err);
  }
};

function generateJwtToken(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_KEY);
  return token;
}
exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("please enter username And password!!");
  }

  // featching the data from the database

  const user = await User.findAll({ where: { email: email } });

  // cripting he user password with database cripted password

  bcrypt.compare(password, user[0].password, function (err, result) {
    if (err) {
      console.log("bcrypt problem");
    }
    if (result === false) {
      res.status(404).json({ message: "incorrect email or password!" });
    }
    if (result === true) {
      res.status(201).json({
        mesaage: "success",
        token: generateJwtToken(user[0].id),
        user: user,
      });
    }
  });
};
