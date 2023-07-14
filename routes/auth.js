import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// const { validate } = require('../models/User');
const JWT_SECRET = 'helloAbhi';
import fetchuser from '../middleware/fetchuser.js'

// ROUTE -1: create a user using: POST "/api/auth/createuser" Doesnot req auth
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password','Password must be atleast 6 characters long').isLength({min:6}),
],async (req,res)=>{

  let success = false
  // if there are errors,return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({Success:success, errors: errors.array() });
    }

    // check whether user with same email exist
    try{
      let user = await User.findOne({email: req.body.email});
      if(user){
        return res.status(400).json({Success:success, error: "Sorry a user with this email already exist"});
      }

      // if everything is fine create user by making hash of its password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
      });
      const data={
        user:{
          id:user.id
        }
      }
      // making authtoken to validate a user (for more security)
      const authToken=jwt.sign(data,JWT_SECRET);
      success=true
      res.json({Success:success,authToken});
    }
    // if some error occured
    catch(error){
      console.error(error.message);
      res.status(500).json().send({Success:success,error: "some internal server error occured"})
    }
});


// ROUTE -2: authenticate a user using get req "api/auth/login" , No login is required
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','password cannot be blank').exists(),
],async (req,res)=>{
  const errors=validationResult(req);
  let success = false
  if(!errors.isEmpty()){
    return res.status(400).json({Success:success, error:errors.array()});
  }
  const {email,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({Success:success,error:"PLease enter correct credentials"});
    }

    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      return res.status(400).json({Success:success,error:"Please enter correct credentials"});
    }

    const data={
      user:{
        id:user.id
      }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true
    res.json({Success:success,authToken});
  }
  catch(error){
    console.error(error.message);
    res.status(500).json().send({Success:success,error:"some internal server error occured"})
  }
});

// ROUTE -3: Get loggedin user details: POST "/api/auth/getUser" Login req
// fetchuser middleware
router.post('/getuser',fetchuser, async (req,res)=>{
  
  try{
    let userId=req.user.id;
    const user= await User.findById(userId).select("-password");
    res.send(user);
  }
  catch(error){
    console.error(error.message);
    res.status(500).json().send({error:"some internal server error occured"});
  }

});

router.post('/google/signIn', async(req,res)=>{

  try {
    const { name,email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash("helloAbhi", salt);
        user = await User.create({
        name: name,
        password: secPass,
        email: email
      });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json().send({ Success: success, error: "some internal server error occured" })
  }

})

export default router;

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt=require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');


