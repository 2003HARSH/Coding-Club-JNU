const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  center: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
 
  registrationDate: {
    type: Date,
    default: Date.now,
  },
},{ collection: 'Student' });

module.exports = mongoose.model('Student', studentSchema);                                                          