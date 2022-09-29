const express = require("express");
const router = express.Router();
const withdrawal = require('../models/withdrawal');

router.route("/withdrawal").get(async(req, res, next) =>{
    try {
      const withdraw = await withdrawal.find({});
      if (withdraw == null) {
        return res.status(400).json({
          success: false,
          message: "There is no data in withdrawal",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Data has been Successfully received",
          data: withdraw
        });
      }
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

  module.exports = router;