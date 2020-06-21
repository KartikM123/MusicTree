var express = require('express');
var router = express.Router();
let https = require('https');
var request = require('request');

let subscriptionKey = 'f0cfeb6a341446e5993908b156c032c0';
let host = 'https://api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';

router.get('/', function(req, res, next) {
    console.log(encodeURIComponent(req.query.albumName))
    let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(req.query.albumName),
        headers : {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let rp = {
        q: encodeURIComponent(req.query.albumName)
    };
    let url = host +  path;
    let headers = {
        'Ocp-Apim-Subscription-Key': subscriptionKey
    };
    
    let response_handler = function (response) {
        let body = '';
    };

    request({headers: headers, url:url, qs:rp}, function(err, response, body) {
        if(err) { console.log(err); return; }
        console.log("Get response: " + response.statusCode);
        if (response.statusCode == 200){
            let imageResults = JSON.parse(body);
            let firstImageResult = imageResults.value[0];
            console.log(firstImageResult);
            res.send(imageResults.value[0].thumbnailUrl);
            console.log(`Image result count: ${imageResults.value.length}`);
            console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
            console.log(`First image web search url: ${firstImageResult.webSearchUrl}`);
        }
      });

});

module.exports = router;