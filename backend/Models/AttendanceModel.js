const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    subjectCode: {
        type: String,
        required: true,
    },
    attendanceDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
