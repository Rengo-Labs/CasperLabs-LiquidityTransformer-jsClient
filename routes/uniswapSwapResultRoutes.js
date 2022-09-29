const express = require("express");
const router = express.Router();
const UniswapSwapedResult = require("../models/uniswapSwapResult");

router.route("/uniswapSwapResult").get(async (req, res, next) => {
  try {
    const uniswapSwapedResult = await UniswapSwapedResult.find({});
    if (uniswapSwapedResult == null) {
      return res.status(400).json({
        success: false,
        message: "There is no data in Uniswap Swaped Result",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Data has been Successfully received",
        data: uniswapSwapedResult,
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
