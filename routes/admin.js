const express=require('express')
const router=express.Router()
const mongoose = require("mongoose")
const {isAdmin} = require("../helpers/isAdmin")


//call the models files
require("../models/Category")
require("../models/Post")
//instance of the models
const Category = mongoose.model("categories")
const Post = mongoose.model("posts")

router.get('/', isAdmin, (req, res)=> {
      res.render('admin/index')
})

router.get('/posts', isAdmin, (req, res) => {
      
      res.send('Posts page')
})

router.get("/category/add", isAdmin, (req, res)=>{
      res.render('admin/addcategory')
})

router.post("/categories/new", isAdmin, (req, res) =>{
      var errors = []
      
      if(!req.body.name || typeof req.body.name == undefined || req.body.name == null ){
            errors.push({text: "invalid name"})
      }

      if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
            errors.push({text: "invalid slug"})
      }
       
      if(req.body.name.length < 2){
            errors.push({text: "name too short"})
      }

      if(req.body.slug.length < 2){
            errors.push({text: "slang too short"})
      }

      if(errors.length > 0){
            res.render("admin/addcategory", {errors: errors})
      }else{

            const newCategory = {

                  //name of the inputs/data of the user input
                  name: req.body.name,
                  slug: req.body.slug
            }

            
            new Category(newCategory).save().then(() => {
                  req.flash("success_msg", "Success on creation of category!")
                  res.redirect("/admin/categories")
            }).catch((err)=>{
                  req.flash("error_msg", "Error on creation of category!")
                  res.redirect("/admin")
            })      
      
      }

      
})
router.get("/categories/edit/:id", isAdmin, (req, res)=>{
      var doc = Category.findOne({_id:req.params.id}).lean().then((doc) =>{
            res.render("admin/editcategories",{doc: doc})
      }).catch((err)=>{
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/admin/categories");
      })
      
})

router.post("/categories/edit", isAdmin, (req, res) => {
      var doc = Category.findOne({_id: req.body.id}).then((doc) =>{
            
            doc.name = req.body.name
            doc.slug = req.body.slug

            doc.save().then(() => {
                  req.flash("success_msg", "Category edited with success!")
                  res.redirect("/admin/categories")
            }).catch((err) =>{
               req.flash("error_msg", "Error when to try to edit category!")
               res.redirect("/admin/categories")
      })
})
})

router.post("/categories/delete", isAdmin, (req, res) => {
      var doc = Category.findOne({_id: req.body.id}).then((doc) =>{
            doc.remove().then(() => {
                  req.flash("success_msg", "Category deleted with success!")
                  res.redirect("/admin/categories")
            }).catch((err) =>{
               req.flash("error_msg", "Error when to try to delete category!")
               res.redirect("/admin/categories")
      })
})
})

router.get("/categories", isAdmin, (req, res)=>{
      var docsv = Category.find().lean().then((docsv)=>{
            if(typeof docsv == undefined || docsv == null ){
                  cat = false
            }else{
                  cat = true
                  }
            res.render("admin/categories", {dados:docsv})
      }).catch((err) =>{
            req.flash("error_msg", "Error when trying to list the categories!")
            res.redirect("/admin")
      })

})

router.get('/postspage', isAdmin, (req, res) =>{

      Post.find().populate("category").sort({data:"desc"}).lean().then((posts) =>{
            res.render("admin/postspage", {posts: posts})
      }).catch((err) => {
            req.flash("error_msg", "Error when trying to register the posts! " + err)
            res.redirect("/admin")
      })

})

router.get('/postspage/add', isAdmin, (req, res) =>{
      var doc = Category.find().lean().then((dados2) =>{
            res.render("admin/addpost", {categorie: dados2})
      }).catch((err) =>{
            req.flash("error_msg", "Error when to trying to load the page!")
            res.redirect("/admin")
      })
})
router.post("/postspage/new", isAdmin, (req, res) => {
      
      var errors = []

      if(req.body.category == "0"){
            errors.push({text: "Invalid category, to register a category!"})
      }

      if(errors.length > 0){
            res.render("admin/addpost", {errors: errors})
      }else{
            const newPosts = {
                  title: req.body.title,
                  slug: req.body.slug,
                  description: req.body.description,
                  content: req.body.content,
                  category: req.body.category
            }

            new Post(newPosts).save().then(() =>{
                  req.flash("success_msg", "Post created with success!")
                  res.redirect("/admin/postspage")
            }).catch((err) =>{
                  req.flash("error_msg", "ERROR when trying to save the post " + err)
                  res.redirect("/admin/postspage")
            })
      }
})

router.get("/postspage/edit/:id", isAdmin, (req, res) => {
      Post.findOne({_id: req.params.id}).lean().then((posts) => {
            Category.find().lean().then((categories)=>{
                  res.render("admin/editposts", {categories: categories, posts: posts})

            }).catch((err) =>{
                  req.flash("error_msg","Error when trying to list the categories! " + err)
                  res.redirect("/admin/postspage")
            })
      }).catch((err) => {
            req.flash("error_msg", "Error when tryng to register the form! "+ err )
            res.redirect("/admin/postspage")
      })
})

router.post("/postspage/edit", isAdmin, (req, res) =>{

      Post.findOne({_id: req.body.id}).then((posts) =>{
            
            posts.title = req.body.title
            posts.slug = req.body.slug
            posts.description = req.body.description
            posts.content = req.body.content
            posts.category = req.body.category

            posts.save().then(() => {
                  req.flash("success_msg", "Post created with success!")
                  res.redirect("/admin/postspage")
            }).catch((err) =>{
                  req.flash("error_msg", "Internal error! " + err)
                  res.redirect("/admin/postspage")
            })
      }).catch((err) =>{
            req.flash("error_msg", "Error when tryng to save the edition! " + err )
            res.redirect("/admin/postspage")
      })

})

router.post("/postspage/delete", isAdmin, (req, res) => {
      Post.findOne({_id: req.body.id}).then(() =>{
            Post.deleteOne({_id: req.body.id}).then(() => {
                  req.flash("success_msg", "Post deleted with success!")
                  res.redirect("/admin/postspage")
            }).catch((err) =>{
                  req.flash("error_msg", "Error when to try to delete! " + err)
                  res.redirect("/admin/postspage")     
            })      
      }) 
})
module.exports = router;