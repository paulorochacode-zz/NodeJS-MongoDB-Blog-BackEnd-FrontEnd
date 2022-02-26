const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

//user model e collection
require("../models/User")
const User = mongoose.model("users")

//auth
module.exports = function(passport){ //in case other language passwordField:senha  ,passwordField: 'password'               
      passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
            
            User.findOne({email: email}).then((user) => {
                  
                  if(!user){
                        return done(null, false, {message: "This account does not exist"})
                  }

                  bcryptjs.compare(password, user.password, (error, correct) => {
                        if(correct){
                              return done(null, user)
                        }else{
                              return done(null, false, {message: "incorrect password"})
                        }
                  })
            })
      }))

      //save data on settings
      passport.serializeUser((user, done) => {
            done(null, user.id)
      })

      passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                  done(err, user)
            })
      })

}
