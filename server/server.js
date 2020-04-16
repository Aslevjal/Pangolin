const express = require('express');
const app = express();
const port = 8080;
const crypto = require('crypto');
var mongoose = require('mongoose');

var db = require('./config/db');
console.log("connecting to DB -- ", db);
mongoose.connect(db.url)

app.use(express.json());

app.get('/', (req, res) => res.send("Start project"));

var User = require('./app/models/Pangolin');

app.get('/api/users', function(req, res) {
    User.find(function(err, pangolins) {
        if (err)
            res.send(err);
        res.json(pangolins);
    }) 
});

app.post('/api/users/register', function(req, res) {
    var id = crypto.randomBytes(16).toString("hex");
    var _user = new User();

    User.find({ 'name': req.body.name, 'email': req.body.email}, function(err, user) {
        if (err) {
            console.log('Signup Error');
        }
        if (user.length != 0) {
            console.log('Username or Email already exist');
            res.status(500);
        }
        _user._id = id;
        _user.name = req.body.name;
        _user.email = req.body.email;
        _user.password = req.body.password;
        if (res.statusCode == 500) {
            res.send("Name or Email already used !!!");
        } else {
            _user.save(function (err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User created!', _id: id })
            });
        }
    })
});

app.post('/api/users/login', function (req, res) {
    User.find({ 'email': req.body.email, 'password' : req.body.password }, function (err, user) {
        if (err) {
            console.log('Sigin Error');
        }
        if (user.length == 0) {
            console.log(req.body)
            console.log('Wrong login');
            res.status(500);
        }
        if (res.statusCode == 500) {
            res.send("Wrong email or password");
        } else {
            console.log("id = " + user[0]._id);
            res.json({ message: 'User logged!', _id: user[0]._id })
        }
    })
});

app.delete('/api/users/delete/:user_id', function(req, res) {
    User.remove({
        _id: req.params.pangolins_id
    }, function(err, bear) {
        if (err)
            res.send(err);
        res.json( {message: 'successfully deleted' } );
    });
})

app.get('/test', function(req, res) {
    res.send("Route for testing")
});

app.listen(port, () => console.log('Server listenning on port '+ port +'!'));