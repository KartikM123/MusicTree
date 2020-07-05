var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

let clientID = '70577384f8d644098aac77105315ed65';
let clientSecret = '79ce048ea7e44d29958c36f5e6b4efae';
let host = 'https://accounts.spotify.com';
let path = '';
let redirect_uri = 'localhost:3000';
let access_token = 'NONE'

router.get('/', function(req, res, next) {
    let targetArtist = req.query.targetArtist;
    let keyword = req.query.Keyword;
    let genre = req.query.genre;

    console.log("Here")

    if (true || access_token === 'NONE'){
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

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
        
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            access_token = token;
//            res.send(getRecs(access_token))
                console.log(access_token)
                let honneID = '0Vw76uk7P8yVtTClWyOhac'
                
                        var recOptions = {
                            url: `https://api.spotify.com/v1/recommendations?seed_artists=${honneID}`,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        };
                        console.log(token)
                        var headers = {
                            'Authorization': 'Bearer ' + token
                        };
                        // recOptions = {
                        //     url: `https://api.spotify.com/v1/recommendations?seed_artists=${honneID}&seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.4&min_popularity=50&market=US`,
                        //     headers: headers
                        // };

                        console.log(recOptions)
                        request.get(recOptions, function(error, response, body) {
                            if (!error && response.statusCode === 200) {

                            // use the access token to access the Spotify Web API
                            res.send(JSON.parse(body)["tracks"])
                            } else {
                                console.log("shit!")
                                res.send(response.statusCode)
                            }
                        });
           } else {
                res.send(response.statusCode)
            }
        });
    } else {
        //authorization complete
        res.send(getRecs(access_token))
    }

});

function getRecs (access_token) {
    let honneID = '0Vw76uk7P8yVtTClWyOhac'
    console.log("Getting recs!")
    console.log(new Buffer(access_token).toString('base64'))
    var recOptions = {
        url: 'https://api.spotify.com/v1/recommendations',
        headers: {
            'Authorization': 'Bearer ' + new Buffer(access_token).toString('base64')
        },
        form: {
            seed_artists: (new Buffer(honneID).toString('base64'))
        },
        json: true
    };

    request.post(recOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
    
        // use the access token to access the Spotify Web API
        console.log(body.tracks.artists[0]);
        return (body.tracks)
        } else {
            console.log(response.statusCode)
            return (response.statusCode)
        }
    });

}

module.exports = router;