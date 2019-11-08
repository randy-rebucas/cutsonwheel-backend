const mongoose = require('mongoose');

const classificationSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    services: [{
        type: { type: String },
        duration: { type: String },
        price: { type: String }
    }]
}, { strict: false, timestamps: {} });

module.exports = mongoose.model('Classifications', classificationSchema);