// user model
//mongoose model
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
require("dotenv").config();

//schema with name and phone number alone both required
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, uid: this.uid}, process.env.JWT_SECRET_KEY)
}

//export model
module.exports = mongoose.model('User', userSchema);


