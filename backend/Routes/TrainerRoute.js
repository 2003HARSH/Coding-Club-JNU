const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Trainer = require('../Models/TrainerModel');
const AttendanceTiming = require('../models/AttendanceTiming'); // Adjust to match your actual model location

// Utility function to find trainer by phone or TrainerId
async function TrainerFindByPhoneOrId(phone, TrainerId) {
    return await Trainer.findOne({
        $or: [{ phone }, { TrainerId }]
    });
}

// Utility function to find trainer by subject code
async function TrainerFindBySubject(phone, TrainerId, subjectCode) {
    return await Trainer.findOne({
        $or: [{ phone }, { TrainerId }],
        subjectCode
    });
}

// Register a new trainer
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

// Login for trainers
router.post('/TrainerLogin', async (req, res) => {
  
  const { trainerId, password } = req.body;

  if (!trainerId || !password) {
      return res.status(400).json({ message: 'Trainer ID and password are required' });
  }

  try {
      console.log('Login attempt for:', trainerId);
      const trainer = await Trainer.findOne({ TrainerId: trainerId }); // Match field name

      if (!trainer) {
          console.log('Trainer not found:', trainerId);
          return res.status(404).json({ message: 'Trainer not found' });
      }

      console.log('Trainer found:', trainer);
      const isPasswordValid = await bcrypt.compare(password, trainer.password);

      if (!isPasswordValid) {
          console.log('Invalid password for:', trainerId);
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('Login successful for:', trainerId);
      return res.status(200).json({ message: 'Login successful', trainer });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});


// Fetch all trainers
router.get('/fetchTrainer', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json(trainers);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ message: "Failed to fetch trainers", error: error.message });
    }
});

// Fetch a specific trainer by trainerId or subjectCode
router.get('/api/trainers/:identifier', async (req, res) => {
    const { identifier } = req.params; // identifier can be either trainerId or subjectCode

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


router.post('/api/setSessionTimings', async (req, res) => {
    const { subjectCode, duration } = req.body;

    if (!subjectCode || !duration) {
        return res.status(400).json({ message: 'Subject code and duration are required' });
    }

    try {
        // Calculate start and end times
        const now = new Date();
        const startTime = now;
        const endTime = new Date(now.getTime() + duration * 60 * 1000); // duration in minutes

        // Check if a timing already exists for the subjectCode
        let timing = await AttendanceTiming.findOne({ subjectCode });

        if (!timing) {
            // Create a new record if it doesn't exist
            timing = new AttendanceTiming({
                subjectCode,
                isAttendanceOpen: true,
                startTime,
                endTime,
            });
        } else {
            // Update the existing record
            timing.startTime = startTime;
            timing.endTime = endTime;
            timing.isAttendanceOpen = true;
        }

        await timing.save();
        res.status(200).json({ message: 'Session timings set successfully', timing });
    } catch (error) {
        console.error('Error setting session timings:', error);
        res.status(500).json({ message: 'Failed to set session timings', error: error.message });
    }
});



// Endpoint to check if attendance is open
router.get('/api/isAttendanceOpen', async (req, res) => {
    try {
        const activeSession = await AttendanceTiming.findOne({
            isAttendanceOpen: true,
            endTime: { $gte: new Date() }, // Check if the session is still ongoing
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




module.exports = router;
