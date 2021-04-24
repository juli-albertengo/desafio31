//Express & Path
const express = require('express');
const path = require('path');

/*Body Parser
const bodyParser = require('body-parser');
*/

//Passport
const bCrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//My own functions & models
const connectToDB = require('./repositories');
const User = require('./user');

//Setup
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'mySecret',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 20000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Passport Login
const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, 
    function(req, username, password, done){
        User.findOne({'username': username},
        function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                console.log('User not found');
                return done(null, false, console.log('message', 'User not found'));
            }
            if(!isValidPassword(user, password)){
                console.log('Invalid Password');
                return done(null, false, console.log('message', 'Invalid Password'));
            }
            return done(null, user);
        })
    }
));

//Passport Signup
const createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, 
    function(req, username, password, done){
        findOrCreateUser = function(){
            User.findOne({'username': username}, function(err, user){
                if(err){
                    console.log('Error in signup: ' + err);
                    return done(err)
                }
                if(user){
                    console.log('User already exists');
                    return done(null, false, console.log('message', 'User already exists'));
                } else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.body.email;
                    newUser.firstName = req.body.firstName;
                    newUser.lastName - req.body.lastName;
                    newUser.save(function(err){
                        if(err){
                            console.log('Error saving user: ' + err)
                            throw err;
                        }
                        console.log('User registration completed successfully');
                        return done(null, newUser);
                    })
                }
            })
        }
    process.nextTick(findOrCreateUser);
}))

//Serialization
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

//Rutas
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname + '/index.html'))
})

//Login
app.get('/login', (req,res)=> {
    if(req.isAuthenticated()){
        let user = req.user;
        res.sendFile(path.join(__dirname + '/welcome.html'))
    } else {
        console.log('User no se ha podido logear');
        res.redirect('/');
    }
})
app.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), (req, res)=> {
    let user = req.user;
    res.sendFile(path.join(__dirname + '/welcome.html'))
});
app.get('/faillogin', (req, res)=> {
    res.send('Login failed')
})

//Signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/signup.html'))
})
app.post('/signup', passport.authenticate('signup', {failureRedirect: '/failsignup'}), (req, res) => {
    let user = req.user;
    res.sendFile(path.join(__dirname + '/index.html'))
});
app.get('/failsignup', (req, res) => {
    res.send('Failed to signup');
})

app.get('/logout', (req, res) => {
    req.logout();
    console.log('deslogeo oka');
    res.redirect('/');
})

app.listen(8080 || process.env.PORT, async(req, res) => {
    console.log(await connectToDB());
});
