var path = require('path');
var config = require(path.resolve('../../config/config.js'))
var Nightmare = require('nightmare');
var nightmare = Nightmare({show:true});

var checkLogin = function (){
    nightmare.goto(config.webAutomater.loginPage)
    .wait(20000)
    .cookies.get()
    .end()
    .then(function(result){
        for (var i = 0; i < result.length; i++){
            if(result[i].name == 'session_loginStatus'){
                if(result[i].value == 'True'){
                    return True
                }
            }
        }
    })
}

if (checkLogin()){
    console.log("Logged In")
} else {
    console.log("not Logged In")
}