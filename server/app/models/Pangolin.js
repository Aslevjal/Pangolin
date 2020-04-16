var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id: { type: String },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
});