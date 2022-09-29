const express = require("express");
const router = express.Router();
const Stake = require('../models/stake');

router.route("/getStakeData").post(async(req, res, next) =>{
    try {
      if (!req.body.stakerId) {
        return res.status(400).json({
          success: false,
          message: "There is no stakerId specified in the req body.",
        });
      }
      const stakes = await Stake.find({staker:req.body.stakerId});
      if (stakes.length==0) {
        return res.status(400).json({
          success: false,
          message: "There is no data in Stake Model",
        });
      } else {
        return res.status(200).json({
            success: true,
            message: "Stake Data against stakerId has been Successfully received",
            stakesData: stakes
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