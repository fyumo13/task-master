const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({ 
    secret: 'VlamERt351#!#45#13MckbB$24FcA00lpcp99FVWbnt!$22',
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 260 }),
    saveUninitialized: false,
    resave: false,
    cookie: { secure: true }
}));

redisClient.on('error', function(err) {
    console.log('Error: ' + err);
});

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { dbName: 'task-master', useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

const usersRouter = require('./routes/user.router');
const taskListsRouter = require('./routes/task-list.router');
const tasksRouter = require('./routes/task.router');

app.use('/users', usersRouter);
app.use('/task-lists', taskListsRouter);
app.use('/tasks', tasksRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});