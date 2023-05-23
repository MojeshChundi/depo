const Razorpay = require('razorpay');
const Orders = require('../models/orders');
require('dotenv').config();

exports.purchasePremium =
  ('/user/purchasePremium',
  async (req, res, next) => {
    try {
      let rzp = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
      const amount = 10000;
      rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        } else {
          req.user
            .createOrder({ orderid: order.id, status: 'PENDING' })
            .then(() => {
              return res.status(201).json({ order, key_id: rzp.key_id });
            })
            .catch((err) => console.log(err));
        }
      });
    } catch (err) {
      res.status(403).json({ message: 'something went wrong!' });
      console.log(err);
    }
  });

exports.updateTrasactionStatus =
  ('/user/status',
  async (req, res, next) => {
    try {
      const { order_id, payment_id } = req.body;
      const order = await Orders.findOne({ where: { orderid: order_id } });
      if (req.body.pf !== 'fail') {
        const promise1 = order.update({
          paymentid: payment_id,
          status: 'SUCCESSFUL',
        });
        const promise2 = req.user.update({ ispremium: true });
        Promise.all([promise1, promise2])
          .then(() => {
            res.status(201).json({
              success: true,
              message: 'transaction successful!',
              user: req.user,
            });
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        const promise1 = order.update({
          paymentid: payment_id,
          status: 'FAILED',
        });
        const promise2 = req.user.update({ ispremium: false });
        Promise.all([promise1, promise2])
          .then(() => {
            res
              .status(201)
              .json({ success: true, message: 'transaction failed!' });
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    } catch (err) {
      res.status(403).json({ message: 'something went wrong!' });
      console.log(err);
    }
  });
