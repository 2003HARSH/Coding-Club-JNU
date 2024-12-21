const mongoose = require('mongoose');

const attendanceTimingSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
    },
    isAttendanceOpen: {
        type: Boolean,
        default: false,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
},{ collection: 'AttendanceTiming' });

module.exports = mongoose.model('AttendanceTiming', attendanceTimingSchema);
