const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    avatar: { type: String },
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    gender: { type: String, default: null },
    age: { type: String, default: null },
    birthdate: { type: Date, default: null },
    status: { type: String, default: null },
    contact: { type: String, default: null },
    classification: { type: mongoose.Schema.Types.ObjectId, ref: 'Classifications' },
    sss: { type: String, default: null },
    tin: { type: String, default: null },
    philhealth: { type: String, default: null },
    address: [{
        address1: { type: String }, // street address
        address2: { type: String }, // street address line 2
        city: { type: String },
        province: { type: String },
        postalCode: { type: Number },
        country: { type: String }
    }],
    activated: { type: Boolean, default: false }
}, { timestamps: {} });

userSchema.virtual('fullName').get(() => {
    return this.firstname + ' ' + this.lastname
})

userSchema.virtual('fullName').set((name) => {
    let str = name.split(' ')

    this.firstname = str[0]
    this.lastname = str[1]
})

module.exports = mongoose.model('Users', userSchema);