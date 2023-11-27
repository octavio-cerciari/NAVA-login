const bodyParser = require("body-parser");
var path = require('path');
const express = require("express");
const app = express();
const db = require('./connection');
const postModel = require('./postModel');
var cors = require('cors');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

app.use(cors({
  origin: true, // "true" will copy the domain of the request back
                // to the reply. If you need more control than this
                // use a function.

  credentials: true, // This MUST be "true" if your endpoint is
                     // authenticated via either a session cookie
                     // or Authorization header. Otherwise the
                     // browser will block the response.

  methods: 'POST,GET,PUT,OPTIONS,DELETE' // Make sure you're not blocking
                                         // pre-flight OPTIONS requests
}));


app.post('/user', async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const posts = await postModel.findOne({email: email});
    if (posts) { res.status(401).json({ error: 'Email já cadastrado!' }) }
    else {
      const newPost = await postModel.create({name, email, password});
      res.json(newPost);
    }
  }
  catch (error) {
    res.status(500).send(error);
  }
});


app.get('/user', verifyJWT ,async (req, res, next) => {
  const token = req.headers['authorization'];
  try {
    const posts = await postModel.findOne({session: token});
    res.json(posts);
  }
  catch (error) {
    res.status(500).send(error);
  }
});

app.get('/user/:id', async (req, res, next) => {
  const {id} = req.params;

  try {
    const posts = await postModel.findById(id);
    res.json(posts);

  }
  catch (error) {
    res.status(500).send(error);
  }
});

app.put('/user/:id', verifyJWT,async (req, res, next) => {
  const {id} = req.params;
  const { name, email } = req.body;
  try {
    const posts = await postModel.findByIdAndUpdate(id, {name,email});
    //res.json("Updated Successfully")
    try {
      const post = await postModel.findById(id);
      res.json(post);
      //res.json("Updated Successfully");
    }
    catch (error) {
      res.status(500).send(error);
    }
  }
  catch (error) {
    res.status(500).send(error);
  }
});


app.delete('/user', verifyJWT,async (req, res, next) => {
  const token = req.headers['authorization'];
  try {
    const posts = await postModel.findOne({session: token});
    await posts.remove();
    res.json(posts);
  }
  catch (error) {
    res.status(500).send(error);
  }
});


function verifyJWT(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const posts = await postModel.findOne({email: email});
    const id = posts.id;
    if (posts.password !== password) { res.status(500).send("invalid email or password"); }
    else {
      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: 1560 // expires in 20min
      });
      await postModel.findByIdAndUpdate(id, {session: token});
      res.json({token});
    }
  }
  catch (error) {
    res.status(500).send("user not found");
  }
});

app.post('/logout', async (req, res, next) => {
  const token = req.headers['authorization'];
  try {
    const posts = await postModel.findOne({session: token});
    const id = posts.id;
    await postModel.findByIdAndUpdate(id, {session: ''});
    res.json(posts);
  }
  catch (error) {
    res.status(500).send(error);
  }
});

//Set the base path to the angular-test dist folder

app.use(express.static(path.join(__dirname, '/dist/frontend')));

console.log("/dist/frontend");

console.log("direcotry name"+__dirname);

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

app.listen(3000, () => {
  console.log("listening on PORT verify: 3000");
});
