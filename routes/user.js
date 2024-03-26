const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signin',(req,res)=>{
    res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup',async(req,res)=>{
    const {fullName,email,password} = req.body;
    await User.create({fullName,email,password});
    return res.redirect('/');
})

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    // console.log(email,password);
    try {
        const token = await User.matchPassword(email,password);
        // console.log(token);
        return res.cookie('token',token).redirect('/');
        
    } catch (error) {
        return res.render('signin',{error:error.message});
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
});
module.exports = router;