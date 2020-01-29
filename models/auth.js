const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    phoneNumber: { type: String, require: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});


module.exports = mongoose.model('Auths', authSchema);