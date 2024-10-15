const mongoose = require('mongoose');
const TrainerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    TrainerId: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },

    subjectCode: {
        type: String,
        required: true,
    },
},{collection:"Trainer"});
mongoose.exports = mongoose.model('Trainer', TrainerSchema);