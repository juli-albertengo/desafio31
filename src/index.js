//Express & Path
const express = require('express');
const path = require('path');
const session = require('express-session');

//Passport
const passport = require('passport');

const MongoStore = require("connect-mongo");

//My own functions & models
const connectToDB = require('../src/repositories/index');
const authorizationsRoutes = require('./routes/authorization.routes');

//Setup
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_STRING,
        ttl: 600,
      }),
      secret: "sh",
      resave: true,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 6000,
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authorizationsRoutes);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname + '/../public/index.html'));
})


app.listen(8080 || process.env.PORT, async(req, res) => {
    console.log(await connectToDB());
});
