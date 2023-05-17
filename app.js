
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const _ = require("lodash");


mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true})

//PostSchema

const postSchema = {
  title : String,
  content : String
}

//model
const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({})
    .then(function(posts) {
      res.render("home", {
        startingContent: homeStartingContent,
        blogPosts: posts
      });
    })
    .catch(function(err) {
      console.log(err);
      // res.sendStatus(500); // or render an error page
    });
});


app.get("/about", function(req,res){
  res.render("about",
  {
    about : aboutContent
  });
});

app.get("/contact", function(req,res){
  res.render("contact",
  {
    contact : contactContent
  });
});

app.get("/compose", function(req,res){
  res.render("compose");
});


app.get("/posts/:postName", function(req, res) {
  Post.find({}).then(function(posts) {
    var matchingPost = posts.find(function(post) {
      return _.lowerCase(req.params.postName) === _.lowerCase(post.title);
    });
    if (matchingPost) {
      res.render("post", {
        postTitle: matchingPost.title,
        postBody: matchingPost.content
      });
    } else {
      // If no matching post was found, render a 404 page or redirect to a search page.
      res.status(404).send("Post not found");
    }
  }).catch(function(err) {
    console.log(err);
    // Handle the error by rendering an error page or redirecting to an error page.
  });
});



app.post("/compose", function(req,res){
  Post.find({}).then(function(posts) {
    var matchingPost = posts.find(function(post) {
      return req.body.postTitle === post.title;
    });
    if(matchingPost){
      console.log("Already created");
      // alert("Already created");
    }else{
      const post = new Post({
        title:  req.body.postTitle,
        content:  req.body.postBody
      });
      post.save();
      res.redirect("/");
    }
  }).catch(function(err) {
    console.log(err);
    // Handle the error by rendering an error page or redirecting to an error page.
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
