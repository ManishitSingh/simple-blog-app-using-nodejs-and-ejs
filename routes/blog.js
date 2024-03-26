const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    res.render('addBlog',{
        user: req.user
    });
});

router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate('createdBy');
    const comments = await Comment.find({blogId: id}).populate('createdBy');
    // console.log(blog);
    // console.log(comments);
    res.render('blog',{
        user: req.user,
        blog,comments
    });
})

router.post('/',upload.single('cover-Image'),async(req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })

    return res.redirect(`/blog/${blog._id}`);
})

router.post('/comment/:blogId',async(req,res)=>{
    const comment = await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogId: req.params.blogId

    });
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports= router;
