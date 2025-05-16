const express = require("express");
const router = express.Router();

const { authCheck, adminCheck } = require("../middleware/auth");
const { list, getCoupon, create, update, remove } = require("../controllers/coupon");

router.get("/coupons", list);
router.get("/coupon/:slug", getCoupon);
router.post("/coupon", authCheck, adminCheck, create);
router.put("/coupon/:slug", authCheck, adminCheck, update);
router.delete("/coupon/:slug", authCheck, adminCheck, remove);

module.exports = router;
