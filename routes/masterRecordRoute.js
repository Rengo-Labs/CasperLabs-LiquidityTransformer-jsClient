const express = require("express");
const router = express.Router();
const masterRecord = require('../models/MasterRecord');

router.route("/masterRecord").get(async(req, res, next) =>{
    try {
      const master = await masterRecord.find({});
      if (master == null) {
        return res.status(400).json({
          success: false,
          message: "There is no data in Master Record",
        });
      } else {
        return res.status(200).json({
            success: true,
            message: "Data has been Successfully received",
            data: master
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