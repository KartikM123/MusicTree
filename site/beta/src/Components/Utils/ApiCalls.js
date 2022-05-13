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

export async function createPlaylist (playlistURIs) {
    var authURL = "http://localhost:9000/playlist";
    var accessToken =  await fetch(authURL);

    console.log(accessToken)

    var createPlaylistURL = "http://localhost:9000/playlist/createPlaylist?accessToken=" + accessToken;
    var playlistPayload = await fetch(createPlaylistURL);

    console.log(playlistPayload)

    var playlistID = playlistPayload["id"]
    var uris= playlistURIs.join(",")
    var addToPlaylistURL = `http://localhost:9000/playlist/addToPlaylist?accessToken=${accessToken}&playlist_id=${playlistID}&uris=${uris}`;
    
    var addToPlaylistPayload = await fetch(addToPlaylistURL);

    return playlistPayload["href"];
}

export const recommendationToString = (resultObject) => {
    return resultObject["name"] + " by " + resultObject["artists"][0]["name"];
}