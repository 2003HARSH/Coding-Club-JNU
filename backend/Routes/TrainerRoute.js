const express = require('express');
const router = express.Router();

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
    const { name, TrainerId, phone, subjectCode } = req.body;
    try {
        const existingTrainer = await TrainerFindByPhoneOrId(phone, TrainerId);

        if (existingTrainer) {
            const trainerWithSameSubject = await TrainerFindBySubject(phone, TrainerId, subjectCode);

            if (trainerWithSameSubject) {
                return res.status(409).json({ message: "You are already registered for this subject" });
            } else {
                return res.status(409).json({ message: "Trainer with this phone or ID is already registered but not for this subject" });
            }
        }

        const newTrainer = new Trainer({
            name,
            phone,
            TrainerId,
            subjectCode,
        });

        const savedTrainer = await newTrainer.save();
        res.status(201).json({ message: 'Successfully Trainer saved', savedTrainer });

    } catch (error) {
        res.status(500).json({ message: 'Error saving trainer', error });
    }
});

module.exports = router;
