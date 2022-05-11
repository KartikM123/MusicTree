export async function getRecommendations(seed, genreSeeds){

    if (seed == "NA"){
        return -1;
    }

    console.log(seed)
    var targetURL = "http://localhost:9000/getSongs/?seed_artists="+seed.seed_artists + "&seed_tracks=" + seed.seed_tracks + "&seed_genres=" + genreSeeds
    
    var res =  await fetch(targetURL);

    var resultObject = await res.json();
    return resultObject;
}

export async function getAlbumImg(albumRec){
    if (albumRec == undefined) {
        return undefined;
    }

    console.log("gettingAlbumImg")

    var trackID = albumRec["id"]

    var targetURL = "http://localhost:9000/getSongs/getTrackPhoto?track_id="+trackID;
    var res =  await fetch(targetURL);
    
    var resultText = await res.text();

    return resultText;
}

export const recommendationToString = (resultObject) => {
    return resultObject["name"] + " by " + resultObject["artists"][0]["name"];
}