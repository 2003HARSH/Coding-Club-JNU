const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const Student1 = require('./Routes/StudentRoute');

const app = express();

dotenv.config();

app.use(express.json());

app.use(Student1);

const uri = process.env.URI ;
const PORT = process.env.PORT ;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));
