const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("dotenv").config();

const catchDataSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: [Number],
        required: true,
        validate: [locationArrayLimit, '{PATH} exceeds the limit of 2 (latitude, longitude)']
    },
    species: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    imageName: {
        type: [String],
        required: true,
    },
    catchWeight: {
        type: Number,
        required: true,
    }
});

function locationArrayLimit(val) {
    return val.length === 2;
}

//export model
module.exports = mongoose.model('CatchData', catchDataSchema);


