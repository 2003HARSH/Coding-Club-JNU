const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    TrainerId: { type: String, required: true, unique: true },
    subjectCode: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'Trainer' });

module.exports = mongoose.model('Trainer', trainerSchema);
