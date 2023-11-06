const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
    },
    clicked: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('url', urlSchema)