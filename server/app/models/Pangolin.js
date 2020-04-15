var mongoose = require('mongoose');

module.exports = mongoose.model('Pangolin', {
    name: { type: String, default: '' }
});