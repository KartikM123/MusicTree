var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

//for second run
let clientID = '70577384f8d644098aac77105315ed65';
let clientSecret = '79ce048ea7e44d29958c36f5e6b4efae';
let honneID = '0Vw76uk7P8yVtTClWyOhac'

//for intial run
let authorization_complete = false;
var token;

router.get('/', function(req, res, next) {
    getAuthorization(getRecs, res);
});


async function getAuthorization (callback, res){
    console.log("Authorizing!")
    //authorize Spofity API
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    await request.post(authOptions, function(error, response, body) {
        console.log("here")
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            console.log("Successfully Authorized!")
            console.log(body.access_token);
            return callback(body.access_token, res);
        } else {

            console.log("SAD!");
            console.log(response.statusCode, " Failed Auth");
            return null;
        }
    });
}

async function getRecs (ac, res) {
    console.log("Getting recs!")
    console.log(ac)
    var recOptions = {
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${honneID}`,
        headers: {
            'Authorization': 'Bearer ' + ac
        }
    };
    console.log("1")
    request.get(recOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("2")

        // use the access token to access the Spotify Web API
        let total = "";
        for (let i in JSON.parse(body)["tracks"][0]){
            //console.log(i);
            //console.log(JSON.parse(body)["tracks"][0][i])
       }
            console.log(JSON.parse(body)["tracks"][0])

            console.log("__");
        
            res.send(JSON.parse(body)["tracks"][0]);
        } else {
            console.log("3")
            console.log("shit!")
            res.send(response.statusCode)
        }
    });

}

module.exports = router;