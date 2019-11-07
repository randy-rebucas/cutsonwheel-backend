const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});


module.exports = mongoose.model('Auths', authSchema);
