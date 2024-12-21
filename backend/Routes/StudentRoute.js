const express = require('express');
const Student = require('../Models/StudentModel');
const Attendance = require('../Models/AttendanceModel');
let AttendanceTiming = require('../Models/AttendanceTimingModel');
const router = express.Router();

const StudentFind = async (enrollmentNumber) => {
    try {
        const student = await Student.findOne({ enrollmentNumber });
        return student;
    } catch (error) {
        console.error("Error during student find:", error);
        throw new Error("Error during student find");
    }
};
router.post('/StudentRegistration', async (req, res) => {
    const { name, phone, enrollmentNumber, center, subjectCode } = req.body;

    // Validate that all required fields are provided
    if (!name || !phone || !enrollmentNumber || !center || !subjectCode) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the student already exists by enrollment number
        const existingStudent = await Student.findOne({ enrollmentNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this enrollment number already exists" });
        }

        // Create a new student
        const newStudent = new Student({
            name,
            phone,
            enrollmentNumber,
            center,
            subjectCode,
        });

        // Save the student to the database
        await newStudent.save();

        // Send response
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ message: "An error occurred while registering the student", error: error.message });
    }
});
router.post('/StudentAttendance', async (req, res) => {
    const { enrollmentNumber, classCode } = req.body;

    if (!enrollmentNumber || !classCode) {
        return res.status(400).json({ message: "Enrollment number or class code is missing." });
    }

    try {
        const student = await StudentFind(enrollmentNumber);

        if (!student) {
            return res.status(404).json({ message: "No student found with this enrollment number." });
        }

        if (student.subjectCode !== classCode) {
            return res.status(400).json({ message: "Student is not enrolled in this subject." });
        }

        const currentTime = new Date();
        const activeSession = await AttendanceTiming.findOne({
            subjectCode: classCode,
            isAttendanceOpen: true,
            startTime: { $lte: currentTime },
            endTime: { $gte: currentTime }
        });

        if (!activeSession) {
            return res.status(404).json({ message: "No active session found for this subject." });
        }

        const attendance = new Attendance({
            studentId: student._id,
            subjectCode: classCode,
            attendanceDate: currentTime
        });

        await attendance.save();
        res.status(200).json({ message: "Attendance submitted successfully." });
    } catch (error) {
        console.error("Error submitting attendance:", error);
        res.status(500).json({ message: "Failed to submit attendance.", error: error.message });
    }
});

module.exports = router;
