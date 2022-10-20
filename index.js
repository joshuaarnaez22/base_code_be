require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
const router = express.Router();
const config = require('./config/database');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const path = require('path');
const http = require('http').Server(app);

//path routes
// const users = require('./routes/users')(router);
const authentication = require('./routes/authentication')(router);
 const users = require('./routes/users')(router);
const volunteer = require('./routes/volunteer')(router);
const socialworker = require('./routes/socialworker')(router);
const foster = require('./routes/foster')(router);

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, config.options, (err) => {

    if (err) {
        console.log('cant connect to database ' + process.env.DB_NAME);
    } else {
        console.log('connected to the database ' + process.env.DB_NAME);
    }
});

app.use(cors())

//body-parser built in express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//for deployment on hosting and build
app.use(express.static(__dirname + '/app/dist/'));
app.use('/images', express.static(path.join(__dirname, './images')));
app.use('/upload', express.static(path.join(__dirname, './upload')));

//api routes
// app.use('/users', users);
app.use('/authentication', authentication);
app.use('/users', users);
app.use('/volunteers', volunteer);
app.use('/socialworker', socialworker);
app.use('/fosters', foster);

app.get('*', (req, res) => {
     res.send('<h1>Hello from the Server Side</h1>')
    //res.sendFile(path.join(__dirname + '/app/dist/index.html'),)
});


const servers = app.listen(PORT, () => {
    console.log('Connected on port ' + PORT);
});
