var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

//for second run
let clientID = '70577384f8d644098aac77105315ed65';
let clientSecret = '79ce048ea7e44d29958c36f5e6b4efae';

//for intial run
let autorization_complete = false;
var tok;

router.get('/', function(req, res, next) {
    let targetArtist = req.query.targetArtist;
    let keyword = req.query.Keyword;
    let genre = req.query.genre;

    console.log("Here")

    if (access_token === 'NONE'){
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
            tok = token;
                console.log(access_token)
                let honneID = '0Vw76uk7P8yVtTClWyOhac'
                
                        var recOptions = {
                            url: `https://api.spotify.com/v1/recommendations?seed_artists=${honneID}`,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        };
                        console.log(token)
                        // recOptions = {
                        //     url: `https://api.spotify.com/v1/recommendations?seed_artists=${honneID}&seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.4&min_popularity=50&market=US`,
                        //     headers: headers
                        // };

                        console.log(recOptions)
                        request.get(recOptions, function(error, response, body) {
                            if (!error && response.statusCode === 200) {

                            // use the access token to access the Spotify Web API
                            let total = "";
                            for (let i in JSON.parse(body)["tracks"][0]){
                                //console.log(i);
                                //console.log(JSON.parse(body)["tracks"][0][i])
                           }
                            console.log("__");
                            res.send(JSON.parse(body)["tracks"][0]);
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
        console.log(tok);
        let j = getRecs(tok, res);
    }

});

function getRecs (ac, res) {
    let honneID = '0Vw76uk7P8yVtTClWyOhac'
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