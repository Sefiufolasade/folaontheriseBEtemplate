const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const couponschema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        minlength: [3,'Too short'],
        maxlength: [32,'Too long',]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    couponValue: {
      type: String,
      trim: true,
      required: "Input coupon value"  
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    expiry: {
        type: Date,   
    },
},
{timestamps: true}
)

module.exports = mongoose.model("Coupon", couponschema)