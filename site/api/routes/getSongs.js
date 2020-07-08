var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

//for second run
let clientID = '70577384f8d644098aac77105315ed65';
let clientSecret = '79ce048ea7e44d29958c36f5e6b4efae';
let honneID = '0Vw76uk7P8yVtTClWyOhac'
let massID = '4Aj5BsUYgadIeoC759FrhE'
let massTrack = '4aX4Oycsk1fhHIee1zqsDe'
let genre = "acoustic"

//for intial run
let authorization_complete = false;
var token;

router.get('/', function(req, res, next) {
    console.log(req.query.seed_artists);
    console.log(req.query.seed_tracks);
    getAuthorization(getRecs,req,  res);
});


async function getAuthorization (callback, req, res){
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
            return callback(body.access_token, req, res);
        } else {
            console.log(response.statusCode, " Failed Auth");
            return null;
        }
    });
}

async function getRecs (ac, req, res) {
    console.log("Getting recs!")
    console.log(ac)
    var recOptions = {
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${req.query.seed_artists}&genres=${req.query.genre}&seed_tracks=${req.query.seed_tracks}`,
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
        
            parseBestResult(req, res, JSON.parse(body));
        } else {
            console.log("3")
            console.log("shit!")
            res.send(response.statusCode)
        }
    });
}

function parseBestResult(req, res, recList){
    for (let i in recList){
        console.log(i);
        //console.log(JSON.parse(body)["tracks"][0][i])
    }

    res.send(recList.tracks[0])
}

module.exports = router;