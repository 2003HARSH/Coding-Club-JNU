const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Trainer = require('../Models/TrainerModel');
const AttendanceTiming = require('../Models/AttendanceTimingModel'); 
const cron = require('node-cron');
const Student = require('../Models/StudentModel');
const Attendance = require('../Models/AttendanceModel');

async function TrainerFindByPhoneOrId(phone, TrainerId) {
    return await Trainer.findOne({
        $or: [{ phone }, { TrainerId }]
    });
}


async function TrainerFindBySubject(phone, TrainerId, subjectCode) {
    return await Trainer.findOne({
        $or: [{ phone }, { TrainerId }],
        subjectCode
    });
}


router.post('/TrainerRegistration', async (req, res) => {
    const { name, phone, TrainerId, subjectCode, password } = req.body;
    try {
        const existingTrainer = await TrainerFindByPhoneOrId(phone, TrainerId);

        if (existingTrainer) {
            const trainerWithSameSubject = await TrainerFindBySubject(phone, TrainerId, subjectCode);
            if (trainerWithSameSubject) {
                return res.status(409).json({ message: "You are already registered for this subject" });
            } else {
                return res.status(409).json({ message: "Trainer with this phone or ID already exists, but not for the given subject" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTrainer = new Trainer({
            name,
            phone,
            TrainerId,
            subjectCode,
            password: hashedPassword 
        });

        const savedTrainer = await newTrainer.save();
        res.status(201).json({ message: 'Successfully Registered. You can now log in with your TrainerId', savedTrainer });

    } catch (error) {
        res.status(500).json({ message: 'Error saving trainer', error: error.message });
    }
});


const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/TrainerLogin', async (req, res) => {
  const { trainerId, password } = req.body;

  if (!trainerId || !password) {
    return res.status(400).json({ message: 'Trainer ID and password are required' });
  }

  try {
    const trainer = await Trainer.findOne({ TrainerId: trainerId });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, trainer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { trainerId: trainer.TrainerId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
res.status(200).json({ 
  message: 'Login successful',
  token,
  trainerId: trainer.TrainerId,
  subjectCode: trainer.subjectCode  
});
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});



router.get('/fetchTrainer', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json(trainers);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ message: "Failed to fetch trainers", error: error.message });
    }
});

router.get('/api/trainers/:identifier', async (req, res) => {
    const { identifier } = req.params;

    try {
        const trainer = await Trainer.findOne({
            $or: [
                { trainerId: identifier },
                { subjectCode: identifier }
            ]
        });

        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json(trainer);
    } catch (error) {
        console.error("Error fetching trainer:", error);
        res.status(500).json({ message: "Failed to fetch trainer", error: error.message });
    }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.trainer = decoded;
    next();
  });
}

router.get('/api/checkTrainerSubject/:trainerId/:subjectCode', verifyToken,async (req, res) => {
    const { trainerId, subjectCode } = req.params;
  const TrainerId = trainerId;
    try {

      const trainer = await Trainer.findOne({
        TrainerId,
        subjectCode,
      });
  
      if (trainer) {
        console.log()
        res.status(200).json({ isRegistered: true });
      } else {
        console.log(subjectCode,TrainerId)
    
        res.status(404).json({ isRegistered: false, message: 'Trainer is not registered or not registered for this subject' });
      }
    } catch (error) {
      console.error('Error checking trainer registration:', error);
      res.status(500).json({ error: 'Error checking trainer registration' });
    }
  });
  
  router.get('/api/studentsBySubject/:subjectCode', verifyToken, async (req, res) => {
  const { subjectCode } = req.params;
  try {
    const students = await Student.find({ subjectCode });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
router.get('/api/todayAttendance/:subjectCode', verifyToken, async (req, res) => {
  const { subjectCode } = req.params;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const attendance = await Attendance.find({
      subjectCode,
      attendanceDate: { $gte: start, $lte: end }
    }).populate('studentId', 'name enrollmentNumber');

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});
router.delete('/api/deleteAttendance/:id', async (req, res) => {
  console.log("hheh")
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    res.status(200).json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting attendance record." });
  }
});

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // e.g., '3F4D9K'
};

router.post('/api/setSessionTimings', async (req, res) => {
  const { subjectCode, duration, trainerId, latitude, longitude ,deviation} = req.body;

  if (!subjectCode || !duration || latitude == null || longitude == null || !deviation) {
    return res.status(400).json({ message: 'Subject code, duration ,deviation and location required' });
  }

  try {
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 1000);

 
    const existingSession = await AttendanceTiming.findOne({
      subjectCode,
      isAttendanceOpen: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    if (existingSession) {
      return res.status(409).json({
        message: 'An attendance session is already active for this subject.',
        sessionCode: existingSession.sessionCode,
        endTime: existingSession.endTime,
      });
    }

    const sessionCode = generateRandomCode();

    const newTiming = new AttendanceTiming({
      subjectCode,
      isAttendanceOpen: true,
      startTime: now,
      endTime,
      latitude,
      longitude,
      sessionCode,
      trainerId,
      deviation
    });

    await newTiming.save();

    res.status(200).json({
      message: '✅ Session timings set successfully',
      sessionCode,
      timing: newTiming
    });
  } catch (error) {
    console.error('Error setting session timings:', error);
    res.status(500).json({ message: 'Failed to set session timings', error: error.message });
  }
});

  


router.get('/api/isAttendanceOpen', async (req, res) => {
    try {
        const activeSession = await AttendanceTiming.findOne({
            isAttendanceOpen: true,
            endTime: { $gte: new Date() }, 
        });

        if (activeSession) {
            res.status(200).json({ isAttendanceOpen: true });
        } else {
            res.status(200).json({ isAttendanceOpen: false });
        }
    } catch (error) {
        console.error('Error checking attendance status:', error);
        res.status(500).json({ message: 'Error checking attendance status' });
    }
});





cron.schedule('*/5 * * * *', async () => {
    try {
        const currentDate = new Date();
        console.log('Checking for expired sessions at:', currentDate);

        // Log the sessions that are about to be deleted
        const expiredSessions = await AttendanceTiming.find({
            endTime: { $lt: currentDate }
        });
        
        console.log(`Found ${expiredSessions.length} expired sessions.`);

        if (expiredSessions.length > 0) {
            const deleteResult = await AttendanceTiming.deleteMany({
                endTime: { $lt: currentDate }
            });
            console.log(`Deleted ${deleteResult.deletedCount} expired attendance sessions.`);
        } else {
            console.log('No expired sessions found.');
        }
    } catch (error) {
        console.error('Error deleting expired sessions:', error);
    }
});


module.exports = router;
