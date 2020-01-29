const mongoose = require('mongoose');

// add phone number
const userSchema = mongoose.Schema({
    name: {
        firstname: { type: String },
        midlename: { type: String },
        lastname: { type: String }
    },
    displayName: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    isSetupCompleted: { type: Boolean, default: false },
    phoneNumber: { type: Number },
    photoUrl: { type: String },
    address: {
        address1: { type: String }, // street address
        address2: { type: String }, // street address line 2
        city: { type: String },
        province: { type: String },
        postalCode: { type: Number },
        country: { type: String }
    },
    roles: {
        assistant: { type: Boolean },
        client: { type: Boolean }
    },
    gender: { type: String },
    birthdate: { type: Date },
    classification: { type: mongoose.Schema.Types.ObjectId, ref: 'Classifications' },
    sss: { type: String },
    tin: { type: String },
    philhealth: { type: String }
}, { timestamps: {} });

module.exports = mongoose.model('Users', userSchema);