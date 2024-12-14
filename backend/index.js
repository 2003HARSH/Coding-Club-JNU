const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const Student1 = require('./Routes/StudentRoute');
const Trainer = require('./Routes/TrainerRoute')
const app = express();
const cors = require('cors');
const Admin=require('./Routes/AdminRoute')
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
  };
  
app.use(cors(corsOptions));
dotenv.config();

app.use(express.json());

app.use(Student1);
app.use(Trainer);
app.use(Admin);

const uri = process.env.MONGODB_URI ;
const PORT = 5000 ;


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
