import secrets from '../../../secrets.json'

var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

//for second run
let clientID = secrets["clientID"];
let clientSecret = secrets["clientSecret"];
let userID = secrets["userID"];
let oauthToken = secrets["oauthToken"];

router.get('/', function(req, res, next) {
    getAuthorization((ac) => {createPlaylist(ac, req, res)},req,  res);
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
            return callback(body.access_token);
        } else {
            console.log(response.statusCode, " Failed Auth");
            return null;
        }
    });
}
async function getRecs (ac, req, res) {
    var recOptions = {
        url: `https://api.spotify.com/v1/users/fishylishybishy/playlists`,
        headers: {
            'Authorization': 'Bearer ' + ac
        },
        body: {
            "name": "New Playlist",
            "description": "New playlist description",
            "public": false
        }
    };
    console.log(recOptions["url"])
    request.post(recOptions, function(error, response, body) {
        body = JSON.parse(body);
        console.log(body)
    })
}