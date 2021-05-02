const express = require('express');
const path = require('path');
require('dotenv').config();

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../repositories/user');

const authorizationsRoutes = express.Router();

//Serialization
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//TODO: Desafio Clase 28
let fbClientId = '';
let fbClientSecret = '';
let portNumber = '';

if(process.argv[2]){
  portNumber = process.argv[2]
} else {
  portNumebr = process.env.PORT;
}

if(process.argv[3]){
  fbClientId = process.argv[3]
} else {
  fbClientId = process.env.FACEBOOK_APP_ID;
}

if(process.argv[4]){
  fbClientSecret = process.argv[4];
} else {
  fbClientSecret = process.env.FACEBOOK_APP_SECRET;
}

passport.use(
    new FacebookStrategy(
      {
        clientID: fbClientId,
        clientSecret: fbClientSecret,
        callbackURL: `http://localhost:${portNumber}/auth/facebook/callback`,
      },
      function (accessToken, refreshToken, profile, cb) {
        const findOrCreateUser = function () {
          User.findOne({ facebookId: profile.id }, function (err, user) {
            if (err) {
              console.log("Error in SignUp: " + err);
              return cb(err);
            }
            if (user) {
              console.log("User already exists");
              return cb(null, user);
            } else {
              var newUser = new User();
              newUser.facebookId = profile.id;
              newUser.username = profile.displayName;
              newUser.save((err) => {
                if (err) {
                  console.log("Error in Saving user: " + err);
                  throw err;
                }
                console.log("User Registration succesful");
                return cb(null, newUser);
              });
            }
          });
        };
        process.nextTick(findOrCreateUser);
      }
    )
  );

/*Login Routes
authorizationsRoutes.get('/login', (req,res)=> {
    if(req.isAuthenticated()){
        
        res.sendFile(path.join(__dirname + '/../../public/welcome.html'))
    } else {
        console.log('User no se ha podido logear');
        res.redirect('/');
    }
})
*/

authorizationsRoutes.get('/faillogin', (req, res)=> {
    res.send('Login failed')
})

//Logout Routes
authorizationsRoutes.get('/logout', (req, res) => {
    req.logout();
    console.log('deslogeo oka');
    res.redirect('/');
})

//TODO: FACEBOOK ROUTES
authorizationsRoutes.get('/auth/facebook', passport.authenticate('facebook'));
authorizationsRoutes.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
        let user = req.user.username;
        console.log(user);
      // Successful authentication, redirect home.
      res.sendFile(path.join(__dirname + '/../../public/welcome.html'))
    }
);

module.exports = authorizationsRoutes;