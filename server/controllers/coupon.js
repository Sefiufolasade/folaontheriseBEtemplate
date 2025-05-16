const Coupon = require("../models/coupon");
const slugify = require("slugify");

exports.list = async (req, res) => {
  res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
};
exports.getCoupon = async(req,res) => {
  try{
    const getCoupon = await Coupon.findOne({slug: req.params.slug}).exec();
    res.json(getCoupon);
  }
  catch(err){
    res.status(400).send("Failed to fetch Coupon");
  }
}
exports.create = async (req, res) => {
  try {
    const { name, couponValue, minAmount, maxAmount, expiry } = req.body;
    const newCoupon = await new Coupon({
      name,
      slug: slugify(name),
      couponValue,
      minAmount,
      maxAmount,
      expiry,
    }).save();
    res.json(newCoupon);
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create Coupon Failed");
  }
};
exports.update = async (req, res) => {
  try {
    const { name, couponValue, minAmount, maxAmount, expiry } = req.body;
    const updateCoupon = await Coupon.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        slug: slugify(name),
        couponValue,
        minAmount,
        maxAmount,
        expiry,
      },
      { new: true }
    ).exec();
    res.json(updateCoupon);
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create Coupon Failed");
  }
};
exports.remove = async (req, res) => {
  try {
    const deleteCoupon = await Coupon.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleteCoupon);
  } catch (err) {
    res.status(400).send("Coupon Delete Failed");
  }
};
