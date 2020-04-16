var mongoose = require('mongoose');

module.exports = mongoose.model('Friend', {
    _id: { type: String },
    friends: { type: Array, default: [] },
});