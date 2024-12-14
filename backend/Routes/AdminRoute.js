const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.post('/AdminLogin',(req,res)=>{
    const {email,password}= req.body;
    if(email==process.env.Admin_email && password==process.env.Admin_Password){
       return res.status(200).json({message:"Successfully Login"});
    }
    else{
        console.log("onbhb")
        return res.status(400).json({message:"Invalid Credentials"});
    }
})
module.exports=router;