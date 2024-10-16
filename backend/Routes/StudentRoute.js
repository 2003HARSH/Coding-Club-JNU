const express = require('express');
const student = require('../Models/StudentModel');
const router = express.Router();

async function StudentFind(phone, enrollmentNumber, subjectCode) {
    return await student.findOne({
        phone,
        enrollmentNumber,
        subjectCode,
    });
}

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello" });
});

router.post('/StudentRegistration', async (req, res) => {
    const { name, phone, enrollmentNumber, center, subjectCode } = req.body;

    try {
        const existingStudent = await StudentFind(phone, enrollmentNumber, subjectCode);

        if (existingStudent) {
            return res.status(409).json({ message: "You are already registered in this subject" });
        }

        const newStudent = new student({
            name,
            phone,
            enrollmentNumber,
            center,
            subjectCode,
        });

        const savedStudent = await newStudent.save();
        console.log("Student successfully saved.");
        res.status(201).json({ message: 'Successfully student saved', savedStudent });

    } catch (error) {
        console.error("Error occurred during student registration:", error);
        res.status(500).json({ message: "Some error occurred", error: error.message });
    }
});

router.post('/StudentAttendance', (req, res) => {
    const { enrollmentNumber, classcode } = req.body;

    if (enrollmentNumber && classcode) {
        return res.status(200).json({ message: "Attendance marked successfully." });
    } else {
        return res.status(400).json({ message: "Enrollment number or class code is missing." });
    }
});

module.exports = router;
