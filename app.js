// Requiring necessary NPM modules:
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

// Set port for deployement as well as localhost:
const port = process.env.PORT || 3000;

// Initial Setup for the App:
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Connect to a new MongoDB Database, using Mongoose ODM:
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5s9h.mongodb.net/blogDB`);

// Create a new collection to store the blog posts:
const postSchema = new mongoose.Schema ({
	title: String,
	content: String,
  url: String
})
const Post = mongoose.model('Post', postSchema);


// Some random Initial Variables:
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// Handle all 'GET' requests:
app.get("/", (req, res) => {
  Post.find(function(err, posts){
  	if(err) {
  		console.log(err);
  	} else {
      res.render('home', {
        homeStarting: homeStartingContent,
        posts: posts,
      })
  	}
  })
})

app.get("/about", (req, res) => {
  res.render('about', {aboutStarting: aboutContent});
})

app.get("/contact", (req, res) => {
  res.render('contact', {contactStarting: contactContent});
})

app.get("/compose", (req, res) => {
  res.render('compose');
})

app.get('/posts/:url', (req, res) => {
  const inputUrl = _.kebabCase(req.params.url);
  Post.findOne({url: inputUrl}, (err, post) => {
  	if(!err) {
      if(!post) { //when post is undefined i.e. inputUrl is not matching any post
        var post = { //handle the error & prevent the app from crashing
          title: "Page Not Found",
          content: "Please ensure that you have typed correct URL..."
        }
      }
      res.render('post', {
        postTitle: post.title,
        postContent: post.content
      });
    }
  })
})


// Handle 'POST' requests:
app.post("/compose", (req, res) => {
  const post = new Post ({
    title: req.body.title,
    content: req.body.content,
    url: _.kebabCase(req.body.title)
  })
  post.save( err => {
    if(!err) {
      res.redirect("/");
    }
  })
})


// Enable client to listen to the appropriate port:
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
