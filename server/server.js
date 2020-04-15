const express = require('express');
const app = express();
const port = 8080;
var mongoose = require('mongoose');

var db = require('./config/db');
console.log("connecting to DB -- ", db);
mongoose.connect(db.url)

app.get('/', (req, res) => res.send("Start project"));

var Pangolin = require('./app/models/Pangolin');
app.get('/api/pangolins', function(req, res) {
    Pangolin.find(function(err, pangolins) {
        if (err)
            res.send(err);
        res.json(pangolins);
    }) 
});

app.get('/test', function(req, res) {
    res.send("Route for testing")
});

app.listen(port, () => console.log('Server listenning on port '+ port +'!'));