const express = require("express");
const router = express.Router();
const Global = require('../models/global');

router.route("/getGlobalData").get(async(req, res, next) =>{
    try {
      const global = await Global.find({});
      if (global.length==0) {
        return res.status(400).json({
          success: false,
          message: "There is no data in global",
        });
      } else {
        return res.status(200).json({
            success: true,
            message: "Global Data has been Successfully received",
            globalData: global
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