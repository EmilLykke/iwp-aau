const mongoose = require('mongoose')

const Schema = mongoose.Schema


const Genre = new Schema({
    // Maybe should be enum in furture
    name: {type: Schema.Types.String, min: 3, max: 100, required: true },
})

Genre.virtual('url').get(function () {
    return `/catalog/genre/${this._id}`
})

module.exports = mongoose.model('Genre', Genre)