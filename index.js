
const express = require ('express')
const rotas = require ('./routes/admin')
const bodyParser = require('body-parser')
const { engine } = require ('express-handlebars');
const mongoose = require('mongoose')
const admin = require('./routes/admin')
const path = require("path")
const session = require("express-session")
const app = express ()
const flash = require ("connect-flash");
const { post } = require('./routes/admin');
require("./models/Post")
const Post = mongoose.model("posts")
require("./models/Category")
const Category = mongoose.model("categories")
const users = require("./routes/user")
const passport = require("passport")
require("./config/auth")(passport)
const {userName} = require("./config/auth")
const db = require("./config/db")
const port = process.env.PORT || 3002
app.listen(port,()=>{console.log('Server is running..')})
//Configurations
      //Session
app.use(session({
      secret: "NodeBlog",
      resave: true,
      saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//Middleware
app.use((req,res,next) => {
      //global variables
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      //req.user passport variable of the user loged
      res.locals.user = req.user || null;
      next()
})
//bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Handlebars
app.engine('handlebars', engine());
app.set('view engine','handlebars');
app.set("views", "./views");
//app.set("public", "./public");
app.use(express.static('public/img'));
//Mongoose
//create a new DB
mongoose.Promise = global.Promise;
mongoose.connect(db.uri).then(() =>{
      console.log("MongoDB Connected")
}).catch((err) =>{
      console.log("Error by try to connect MongoDB: "+err)
})

//Public
app.use(express.static(path.join(__dirname,"public")))
//Routes
app.get('/', (req, res) =>{
Post.find().populate("category").sort({data: "desc"}).lean().then((posts) => {
      res.render("index", {posts: posts})
}).catch((err) => {
      req.flash("error_msg", "Internal error")
      res.redirect("/404")
})
})

app.get("/posts/:slug", (req, res) => {
Post.findOne({slug: req.params.slug}).lean().then((posts) => {
      if(posts){
            res.render("posts/index", {posts: posts})
      }else{
            req.flash("error_msg", "There isn't that post")
            res.redirect("/")
      }
}).catch((err) => {
      req.flash("error_msg", "Internal error")
      res.redirect("/")
})
})

app.get('/categories', (req, res) => {
Category.find().lean().then((categories) => {
      res.render("categories/index", {categories: categories})
}).catch((err) => {
      req.flash("error_msg", "Internal error to list the categories")
      res.redirect("/")
})
})  

app.get('/categories/:slug', (req, res) => {
Category.findOne({slug: req.params.slug}).then((category) =>{
      //console.log(category)
      if(category){
            Post.find({category: category._id}).lean().then((posts) =>{
                  res.render("categories/postspage",{posts: posts, category: category})
            }).catch((err) => {
                  req.flash("error_msg","Error to list posts")
                  res.redirect("/")
            })
      }else{
            req.flash("error_msg","There isn't this category")
            res.redirect("/")
      }
}).catch((err) =>{
      req.flash("error_msg", "Internal error when trying to load the page")
      res.redirect("/")
})
})     

app.get('/404', (req, res) => {
res.send("Error 404!")
})      

app.get('/posts', (req, res) => {
res.send("List of Ports")
})
app.use('/admin', admin)
app.use("/users", users)
//Others
