var mongoose = require('mongoose');
var User = require('./Pangolin');

module.exports = mongoose.model('UserProfile', {
    _id: { type: String },
    age: { type: String, default: 'age' },
    familly: { type: String, default: 'familly' },
    race: { type: String, default: 'race' },
    food: { type: String, default: 'food' },
    friend: { type: Array, default: [] },
});