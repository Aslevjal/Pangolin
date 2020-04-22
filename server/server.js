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

app.get('/api/user/:email', function (req, res) {
    User.find({ 'email': req.params.email }, function (err, pangolins) {
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

app.get('/api/users/:user_id', function (req, res) {
    User.find({ '_id': req.params.user_id }, function (err, user) {
        if (err) {
            console.log('Find Error');
        }
        if (user.length == 0) {
            console.log(req.body)
            console.log('Wrong Id');
            res.status(500);
        }
        if (res.statusCode == 500) {
            res.send("User doesn't exist");
        } else {
            console.log("id = " + user[0]);
            res.json({ message: 'User Found!', user: user[0] })
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

var UserProfile = require('./app/models/Profile');

app.get('/api/profiles', function (req, res) {
    UserProfile.find(function (err, profiles) {
        if (err)
            res.send(err);
        res.json(profiles);
    })
});

app.post('/api/profiles/create', function (req, res) {
    var _user = new UserProfile();

    UserProfile.find({ '_id': req.body._id}, function (err, user) {
        if (err) {
            console.log('Signup Error');
        }
        if (user.length != 0) {
            console.log('Profile already exist');
            res.status(500).send("Profile already exist !!!");
            return;
        }
        _user._id = req.body._id;
        _user.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Profile created!'})
        });
    })
});

app.post('/api/profiles/edit/:profile_id', function (req, res) {
    var _userProfile = new UserProfile();

    UserProfile.findOneAndRemove({ '_id': req.params.profile_id}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("deleted");
    });

    UserProfile.find({ '_id': req.params.profile_id }, function (err, user) {
        if (err) {
            console.log('ERROR');
            return;
        }
        if (user.length != 0) {
            res.status(500).send("ERROR");
            return;
        }
        _userProfile._id = req.params.profile_id;
        _userProfile.age = req.body.age;
        _userProfile.familly = req.body.familly;
        _userProfile.race = req.body.race;
        _userProfile.food = req.body.food;
        _userProfile.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Profile edited!'})
        });
    })
});

app.get('/api/profiles/:profile_id', function (req, res) {
    UserProfile.find({ '_id': req.params.profile_id }, function (err, profile) {
        if (err) {
            console.log('Find Error');
            res.status(500).send("Profile doesn't exist");
            return;
        }
        if (profile.length == 0) {
            console.log(req.body)
            console.log('Wrong Id');
            res.status(500).send("Profile doesn't exist");
            return;
        }

        res.json({ message: 'Profile Found!', profile: profile[0] })

    })
});

var UserFriend = require('./app/models/Friend');

app.get('/api/friends/:profile_id', function (req, res) {
    var _userFriend = new UserFriend();
    UserFriend.find({ '_id': req.params.profile_id }, function (err, profile) {
        if (err) {
            console.log('Find Error');
            res.status(500).send("Friend List doesn't exist");
            return;
        }
        if (profile.length == 0) {
            console.log(req.body)
            console.log('Wrong Id');
            _userFriend._id = req.params.profile_id;
            _userFriend.save(function (err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Created !!!', friends: profile[0] })
            });
            return;
        }

        res.json({ message: 'Friend List Found!', friends: profile[0] })

    })
});

app.post('/api/friends/edit/:profile_id', function (req, res) {
    var _userFriend = new UserFriend();

    UserFriend.find({ '_id': req.params.profile_id }, function (err, user) {
        if (err) {
            console.log('ERROR');
            return;
        }
        if (user.length != 0) {
            res.status(500).send("ERROR");
            return;
        }
        _userFriend._id = req.params.profile_id;
        _userFriend.friends = req.body.website;
        console.log(req.body.website);
        _userFriend.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Friend List edited!' })
        });
    })
});

app.post('/api/newfriends/edit/:profile_id', function (req, res) {
    var _userFriend = new UserFriend();

    UserFriend.find({ '_id': req.params.profile_id }, function (err, user) {
        if (err) {
            console.log('ERROR');
            return;
        }
        console.log("test= ", req.body.friends);
        if (user.length != 0) {
            res.status(500).send("ERROR");
            return;
        }
        _userFriend._id = req.params.profile_id;
        _userFriend.friends = req.body.friends;
        _userFriend.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'Friend List edited!' })
        });
    })
});

app.get('/api/friends', function (req, res) {
    UserFriend.find(function (err, pangolins) {
        if (err)
            res.send(err);
        res.json(pangolins);
    })
});

app.post('/api/friends/delete/:profile_id', function (req, res) {
    UserFriend.findOneAndRemove({ '_id': req.params.profile_id }, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("ERROR Delete");
            return;
        }
        res.status(200).send("Delete Success");
    });
});

var NewFriends = require('./app/models/newFriends');

app.get('/api/newfriends/:profile_id', function (req, res) {
    var _userFriend = new NewFriends();
    NewFriends.find({ '_id': req.params.profile_id }, function (err, profile) {
        if (err) {
            console.log('Find Error');
            res.status(500).send("Friend List doesn't exist");
            return;
        }
        if (profile.length == 0) {
            console.log(req.body)
            console.log('Test call');
            _userFriend._id = req.params.profile_id;
            _userFriend.save(function (err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Created !!!', friends: profile[0] })
            });
            return;
        }

        res.json({ message: 'New Friend List Found!', friends: profile[0] })

    })
});

app.post('/api/newfriends/delete/:profile_id', function (req, res) {
    NewFriends.findOneAndRemove({ '_id': req.params.profile_id }, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("ERROR Delete");
            return;
        }
        res.status(200).send("Delete Success");
    });
});


app.post('/api/newfriends/edit/:profile_id', function (req, res) {
    var _userFriend = new NewFriends();

    NewFriends.find({ '_id': req.params.profile_id }, function (err, user) {
        if (err) {
            console.log('ERROR');
            return;
        }
        if (user.length != 0) {
            res.status(500).send("ERROR");
            return;
        }
        _userFriend._id = req.params.profile_id;
        _userFriend.newfriends = req.body;
        console.log(req.body);
        _userFriend.save(function (err) {
            if (err)
                res.send(err);
            res.json({ message: 'NewFriends List edited!' })
        });
    })
});

app.get('/test', function(req, res) {
    res.send("Route for testing")
});

app.listen(port, () => console.log('Server listenning on port '+ port +'!'));