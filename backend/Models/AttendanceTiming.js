const mongoose = require('mongoose');

// Define the schema for attendance timing
const AttendanceTimingSchema = new mongoose.Schema({
    subjectCode: { type: String, required: true }, // Added subjectCode for specific sessions
    isAttendanceOpen: { type: Boolean, default: false },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create and export the model
const AttendanceTiming = mongoose.model('AttendanceTiming', AttendanceTimingSchema);

module.exports = AttendanceTiming;
