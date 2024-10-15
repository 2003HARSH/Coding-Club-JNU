const { collection } = require("./StudentModel");

const trainerSchema = new mongoose.Schema({
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer', 
    },
    attendanceSession: [
      {
        subjectCode: {
          type: String,
          required: true,
        },
        center: {
          type: String,
          required: true,
        },
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        sessionActive: {
          type: Boolean,
          default: false, 
        },
      },
    ],
  },{collection:'AttendanceSession'});
  
  module.exports = mongoose.model('Trainer', trainerSchema);
  