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
      latitude: Number,   // NEW
  longitude: Number,
    sessionCode: String,
    deviation:Number,
},{ collection: 'AttendanceTiming' });

module.exports = mongoose.model('AttendanceTiming', attendanceTimingSchema);
