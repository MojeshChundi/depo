const path = require("path");
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const forgotpwdRoutes = require("./routes/forgotpwd");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premUserRoutes = require("./routes/premuser");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const Forgotpassword = require("./models/forgotpwd");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const app = express();

app.use(cors());

//BODY PARSER

app.use(bodyParser.json());

//ROUTES

app.use(expenseRoutes);
app.use(userRoutes);
app.use(purchaseRoutes);
app.use(premUserRoutes);
app.use(forgotpwdRoutes);

app.use((req, res) => {
  res.send(path.join(__dirname, `public/${req.url}`));
});

const accsessLogStream = fs.createWriteStream(
  path.join(__dirname, "accsess.log"),
  { flags: "a" }
);

// MIDDLE WARE
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accsessLogStream }));

//RELATIONS

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

//SERVER
sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
