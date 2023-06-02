require('dotenv').config();

// Modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

// Import Routes
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');

// Express Application
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Prints the backend access logs
app.use((req, res, next) => {
  console.info(`[${new Date().toLocaleString()}] [${req.method}] [${req.originalUrl}] [${req.ip}] [${req.get('User-Agent')}]`);
  next();
});

// Routes
app.get('/api', (req, res) => {
  res.json({ msg: 'This is the API route' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to the database and listen for requests
console.log('Awakening the server...');

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(process.env.PORT, () => {
      console.log('Database connected successfully, listening on port', process.env.PORT)
    })
  })
  .catch((err) => console.log(err))