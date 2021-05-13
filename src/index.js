//Express & Path
const express = require('express');
const path = require('path');
const session = require('express-session');
/*const {fork} = require('child_process');*/

//Passport
const passport = require('passport');

const MongoStore = require("connect-mongo");

//My own functions & models
const connectToDB = require('../src/repositories/index');
const authorizationsRoutes = require('./routes/authorization.routes');

//Setup
require('dotenv').config();
const app = express();

//TODO: Desafio Clase 31 - Compression
const compression = require('compression');
app.use(compression());

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

const portNumber = process.argv[2];

process.on('exit', code => {
  console.log(`About to exit with code: ${code}`)
});

const info = {
  argumentosEntrada: process.argv,
  nombrePlataforma: process.platform,
  versionNode: process.version,
  usoMemoria: process.memoryUsage(),
  pathEjecucion: process.argv[0],
  processId: process.pid,
  currentFolder: process.cwd()
}

/*
app.get('/randoms', (req, res) => {
  let cant = req.query.cant;
  if(!cant){
    cant = 100000000
  }
  let calculo = fork(`${process.cwd()}/src/services/random.js`);
  calculo.send(cant);
  calculo.on('message', dev => {
    res.json(dev)
  })
})*/

app.get('/info', (req, res) => {
  res.json(info)
})


app.listen(portNumber || process.env.PORT, async(req, res) => {
    console.log(await connectToDB());
});
