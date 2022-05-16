var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');
const secrets = require('./secrets.json');
const queryString = require('query-string');
//for second run
let client_id = secrets["clientID"];
let client_secret = secrets["clientSecret"];
let user_id = secrets["userID"];
let oauthToken = secrets["oauthToken"];

let redirect_uri = "http://localhost:9000/playlist/callback"

router.get('/createPlaylist', function(req, res, next) {
    var accessToken = req.query.accessToken
    var createPlaylist = {
        url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
        headers: {
            'Authorization': 'Bearer ' + new Buffer(accessToken)
        },
        body: {
            "name": "Test Playlist",
            "description": "Created using spotify api",
            "public": true
        },
        json: true
    };

    request.post(createPlaylist, function(error, response, body) {
        console.log(response)
        console.log(body)
        // save this responsein a firebase db thatwe will poll for
        res.send(body)
    });
})

router.get('/auth', function(req, res, next) {
    getAuthorization(res, req);
});


router.get('/addToPlaylist', function(req, res , next) {
    const uris = req.query.uris;
    const playlist_id = req.query.playlist_id;
    const accessToken = req.query.accessToken;

    var addToPlaylist = {
      url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${uris}`,
      headers: {
          'Authorization': 'Bearer ' + new Buffer(accessToken)
      },
      body: {
          "name": "Test Playlist",
          "description": "Created using spotify api",
          "public": true
      },
      json: true
  };

  request.post(createPlaylist, function(error, response, body) {
    console.log(response)
    console.log(body)
    res.send(body)
  });
}); 

router.get('/callback', function(req, res, next) {
    console.log("callback hit!");
    console.log(req)
    console.log(res)

    var code = req.query.code || null;
    var state = req.query.state || null;

  if (state === null) {
    console.log("no state!")
  } else {
      console.log("successful state found!")
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
        console.log(body)
        console.log(response)
        console.log("test")
        res.send(response)
    })
  }
});

async function getAuthorization (res, req){
    console.log("getting auth")

    var state = "jkielaimndalimb";
    var scope = 'playlist-modify-public playlist-modify-private';
    var redirect = req.query.redirect
    console.log(redirect)

    res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect,
      state: state
    }));
}

module.exports = router;