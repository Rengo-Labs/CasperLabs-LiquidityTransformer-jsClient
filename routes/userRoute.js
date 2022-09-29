const express = require("express");
const router = express.Router();
var wise = require("../JsClients/WISETOKEN/wiseTokenFunctionsForBackend/functions");

router.route("/wiseBalanceAgainstUser").post(async function (req, res, next) {
  try {
    if (!req.body.contractHash) {
      return res.status(400).json({
        success: false,
        message: "contractHash not found in request body",
      });
    }

    if (!req.body.user) {
      return res.status(400).json({
        success: false,
        message: "user not found in request body",
      });
    }

    let balance = await wise.balanceOf(req.body.contractHash, req.body.user);
    return res.status(200).json({
      success: true,
      message: "Balance has been found against this user.",
      balance: balance,
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});

module.exports = router;
