const express = require('express');
const Student = require('../Models/StudentModel');
const Attendance = require('../Models/AttendanceModel');
let AttendanceTiming = require('../Models/AttendanceTimingModel');
const router = express.Router();
function calculateDistance(lat1, lon1, lat2, lon2) {
  const a = 6378137; // semi-major axis of the Earth (in meters)
  const f = 1 / 298.257223563; // flattening
  const b = 6356752.314245; // semi-minor axis

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const L = toRadians(lon2 - lon1);

  const U1 = Math.atan((1 - f) * Math.tan(φ1));
  const U2 = Math.atan((1 - f) * Math.tan(φ2));

  let sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  let sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let λ = L;
  let λP;
  let iterLimit = 100;
  let sinλ, cosλ, sinσ, cosσ, σ, sinα, cosSqα, cos2σm, C;

  do {
    sinλ = Math.sin(λ);
    cosλ = Math.cos(λ);
    sinσ = Math.sqrt(
      Math.pow(cosU2 * sinλ, 2) +
      Math.pow(cosU1 * sinU2 - sinU1 * cosU2 * cosλ, 2)
    );
    if (sinσ === 0) return 0; // co-incident points

    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    sinα = cosU1 * cosU2 * sinλ / sinσ;
    cosSqα = 1 - sinα * sinα;
    cos2σm = cosSqα === 0 ? 0 : cosσ - 2 * sinU1 * sinU2 / cosSqα;

    C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
    λP = λ;
    λ = L + (1 - C) * f * sinα *
      (σ + C * sinσ *
        (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));

  } while (Math.abs(λ - λP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) return NaN; // formula failed to converge

  const uSq = cosSqα * (a * a - b * b) / (b * b);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const Δσ = B * sinσ * (
    cos2σm + B / 4 * (
      cosσ * (-1 + 2 * cos2σm * cos2σm) -
      B / 6 * cos2σm * (-3 + 4 * sinσ * sinσ) *
      (-3 + 4 * cos2σm * cos2σm)
    )
  );

  const s = b * A * (σ - Δσ);
  return s; // distance in meters
}

function toRadians(deg) {
  return deg * Math.PI / 180;
}


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
  const { enrollmentNumber, classCode, sessionCode, latitude, longitude } = req.body;

  if (!enrollmentNumber || !classCode || !sessionCode || latitude == null || longitude == null) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const student = await StudentFind(enrollmentNumber);
    if (!student) return res.status(404).json({ message: "No student found with this enrollment number." });

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

    if (activeSession.sessionCode !== sessionCode.trim()) {
      return res.status(403).json({ message: "Invalid session code. Attendance denied." });
    }

    const teacherLat = activeSession.latitude;
    const teacherLng = activeSession.longitude;

    if (!teacherLat || !teacherLng) {
      return res.status(500).json({ message: "Trainer location not set for this session." });
    }

    const distance = calculateDistance(latitude, longitude, teacherLat, teacherLng);
console.log(activeSession.deviation)
    if (distance > activeSession.deviation) {
      return res.status(403).json({ message: "You are not within 5 meters of the class. Attendance denied." });
    }

    const attendance = new Attendance({
      studentId: student._id,
      subjectCode: classCode,
      attendanceDate: currentTime
    });

    await attendance.save();
    res.status(200).json({ message: "✅ Attendance submitted successfully." });

  } catch (error) {
    console.error("Error submitting attendance:", error);
    res.status(500).json({ message: "Failed to submit attendance.", error: error.message });
  }
});



module.exports = router;
