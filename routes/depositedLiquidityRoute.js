const express = require("express");
const router = express.Router();
const depositedLiquidity = require('../models/depositedLiquidity');

router.route("/depositedLiquidity").get(async(req, res, next) =>{
    try {
      var depo = await depositedLiquidity.find({});
      if (depo == null) {
        return res.status(400).json({
          success: false,
          message: "There is no data in deposited liquidity",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Data has been Successfully received",
          data: depo
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