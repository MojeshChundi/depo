require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const User = require("../models/user");
const Forgotpassword = require("../models/forgotpwd");

exports.forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      user.createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });

      const client = Sib.ApiClient.instance;

      const apiKey = client.authentications["api-key"];

      apiKey.apiKey = process.env.API_KEY;

      const transEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "mojeshchundi5432@gmail.com",
      };

      const recievers = [
        {
          email: email,
        },
      ];
      transEmailApi
        .sendTransacEmail({
          sender,
          to: recievers,
          subject: "update your email password!",
          textContent: "update your password !",
          htmlContent: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
        })
        .then(() => console.log("mailsent"))
        .catch((err) => console.log(err));
    }
  } catch (err) {
    console.error(err);
    res.json({ message: err, sucess: false });
  }
};

exports.resetpassword = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
      <head>
          <style>
              label {
                  display: block;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
  
              input[type="password"] {
                  padding: 10px;
                  border-radius: 5px;
                  border: 1px solid #ccc;
                  margin-bottom: 10px;
              }
  
              button {
                  padding: 10px;
                  background-color: #007bff;
                  color: #fff;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
              }
  
              button:hover {
                  background-color: #0062cc;
              }
          </style>
      </head>
      <body>
          <form onsubmit="formsubmitted(event)" action="/updatepassword/${id}" method="get">
              <label for="newpassword">Enter New password</label>
              <input name="newpassword" type="password" required></input>
              <button>reset password</button>
          </form>
      </body>
  </html>
  `);
      res.end();
    }
  });
};

exports.updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            // console.log('userDetails', user)
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
