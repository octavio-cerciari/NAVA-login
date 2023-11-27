const bodyParser = require("body-parser");
var path = require('path');
const express = require("express");
const app = express();
const db = require('./connection');
const postModel = require('./postModel');
var cors = require('cors');

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
    const newPost = await postModel.create({name, email, password});
    res.json(newPost);
  }
  catch (error) {
    res.status(500).send(error);
  }
});


app.get('/user', async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const posts = await postModel.find();
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

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const posts = await postModel.findOne({email: email});
    console.log(password)
    console.log(posts)
    if (posts.password !== password) { res.status(500).send("invalid email or password"); }
    else { res.json(posts); }
  }
  catch (error) {
    res.status(500).send("user not found");
  }
});

app.put('/user/:id', async (req, res, next) => {
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


app.delete('/user/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const posts = await postModel.findById(id);
    await posts.remove();
    res.json("Deleted Successfully");
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
