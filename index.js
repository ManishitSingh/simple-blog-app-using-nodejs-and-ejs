const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
mongoose.connect('mongodb://localhost:27017/blogkar').then(()=>{
    console.log('Connected to database');
});

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.get('/', async(req, res) => {
    const allBlogs = await Blog.find();
    res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});