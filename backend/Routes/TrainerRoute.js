const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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
    const { name, TrainerId, phone, subjectCode,password } = req.body;
    try {
        const existingTrainer = await TrainerFindByPhoneOrId(phone, TrainerId);

        if (existingTrainer) {
            const trainerWithSameSubject = await TrainerFindBySubject(phone, TrainerId, subjectCode);

            if (trainerWithSameSubject) {
                return res.status(409).json({ message: "You are already registered for this subject" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const newTrainer = new Trainer({
                name,
                phone,
                TrainerId,
                subjectCode,
                password:hashedPassword
            });

            const savedTrainer = await newTrainer.save();
            res.status(201).json({ message: 'Successfully Registered , You can now login With your TrainerId', savedTrainer });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error saving trainer', error });
    }
});

module.exports = router;
