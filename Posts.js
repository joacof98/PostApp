const express = require("express");
require('dotenv').config({ path: 'variables.env' });
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "hiken98",
  api_key: "195665811916362",
  api_secret: "rH2D3zAtFmKIk6FFOPEW_BnBcC4"
});

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/gif|jpeg|png|jpe$i/)) {
      cb(new Error('File is not supported'), false)
      return
    }

    cb(null, true)
  }
})


//Post Item
const Post = require("../../models/Post");

// @route   GET api/posts
// @desc    Get all Posts
// @access  Public
router.get("/", (req, res) => {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts));
});

// @route   POST api/posts
// @desc    Post one Post (xd)
// @access  Public
router.post("/", upload.single("theImg"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path, 
    { folder: "posts",
      transformation: { width: 500, height: 420, crop: "fill"}
    })
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    imgUrl: result.secure_url
  });
  
  newPost.save().then(post => res.json(post));
  
});

// @route   DELETE api/posts
// @desc    Delete one post by id
// @access  Public
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndRemove(req.params.id);
  res.json({status: "Post Deleted!"});
});

// @route   UPDATE api/posts
// @desc    Update one post by id
// @access  Public
router.put("/:id", async (req, res) => {
  const { title, description } = req.body;
  const newPost = {title, description};
  await Post.findByIdAndUpdate(req.params.id,newPost);
  res.json({status: "Post Updated!"});
});

module.exports = router;

/*
transformation: { width: 500, height: 300, crop: "fill"}
*/