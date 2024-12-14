const express = require('express');
const Student = require('../Models/StudentModel'); 
const router = express.Router();



const StudentFind = async (phone, enrollmentNumber, subjectCode) => {
    try {
     
      const student = await Student.findOne({
        phone: phone,
        enrollmentNumber: enrollmentNumber,
        subjectCode: subjectCode,
      });
      return student;
    } catch (error) {
      console.error("Error during student find:", error);
      throw new Error("Error during student find");
    }
};

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello" });
});

router.post("/StudentRegistration", async (req, res) => {
    const { name, phone, enrollmentNumber, center, subjectCode } = req.body;

  
    if (!name || !phone || !enrollmentNumber || !center || !subjectCode) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingStudent = await StudentFind(phone, enrollmentNumber, subjectCode);

        if (existingStudent) {
            return res.status(409).json({ message: "You are already registered in this subject" });
        }

        const newStudent = new Student({
            name,
            phone,
            enrollmentNumber,
            center,
            subjectCode,
        });

        const savedStudent = await newStudent.save();
        console.log("Student successfully saved.");

        const message = `Hi ${name}, welcome to the platform! Your enrollment number is ${enrollmentNumber}. Please use this ID for future logins.`;
       

        return res.status(201).json({ message: "Student successfully registered", student: savedStudent });
    } catch (error) {
        console.error("Error occurred during student registration:", error);
        return res.status(500).json({ message: "Error occurred while saving the student", error: error.message });
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
