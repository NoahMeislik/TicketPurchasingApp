const path = require('path');
const config = require(path.resolve('./config/config.js'))
var User = require(config.personalApiPaths.models.user);
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');

module.exports.createUser = function(req, res){
    if(!req.body.username || !req.body.email || !req.body.password || req.body.createUserToken !== config.createUserToken){//added in createUserToken to restrict who can create accounts
        return res.status(400).send("Please Supply Username, Email and Password!")
    }

    var newPassword = bcrypt.hashSync(req.body.password, salt);

    var userData = {
        username: req.body.username,
        email: req.body.email,
        password: newPassword,
        isAdmin: false
    }

    var newUser = new User(userData);

    newUser.save(function(err){
        if(err){
            return res.status(500).send("The Server is Down, or your username and password are not unique");
        }

        return res.status(200).send("User was created, you can now login")
    })
}

module.exports.loginUser = function(req, res){
   if (!req.body.login || !req.body.password){
       return res.status(400).send("Please Specify username or password");
   }

   User.find({$or: [{username: req.body.login}, {email: req.body.login}]}, function(err, user){
       if(err){
           return res.status(500).send("Database is currently experiencing difficulties!");
       }

       if (user.length < 1){
           return res.status(400).send("Username or Password is incorrect!");
       }

       var loggedUser = user[0];
       var userData = {
            username: loggedUser.username,
            isAdmin: loggedUser.isAdmin
       };
       var isVerified = bcrypt.compareSync(req.body.password, loggedUser.password);

       if (!isVerified){
           return res.status(400).send("Username or Password is incorrect!");
       }

       var token = jwt.sign(userData, process.env.APP_SECRET, {expiresIn: 60 * 60 * 24 * 1000});

       res.json({
           user: loggedUser.username,
           token: token
       })
   })
}

module.exports.getUserData = function (req, res) {
    if (!req.body.token) return res.status(400).send("No token specified, cannot continue.");
    let token = req.body.token.replace(/["']/g, "");
    jwt.verify(token, process.env.APP_SECRET, function(err, decoded) {
        if (err) return res.status(200).json({error:"invalidUser"})
        let isAdmin = decoded.isAdmin;
        if (isAdmin) return res.status(200).json({isAdmin:true})
        else return res.status(200).json({isAdmin:false})
        
        
    });
}
