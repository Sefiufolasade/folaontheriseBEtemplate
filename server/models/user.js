const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
            index: true,
        },
        nickName: {
            type: String,
            unique: true,
            text: true,
            index: true,
        },
        mobileNo: {
            type: String,
            unique: true,
            sparse: true, // allows multiple null values
        },          
        role: {
            type: String,
            default: 'subscriber'
        },
        cart: {
            type: Array,
            default: [],
        },
        address: String,
        //wishlist: String
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema)