var mongoose = require('mongoose');

module.exports = mongoose.model('NewFriend', {
    _id: { type: String },
    newfriends: { type: Array, default: [] },
});