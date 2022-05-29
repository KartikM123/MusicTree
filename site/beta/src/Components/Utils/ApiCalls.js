import structuredClone from '@ungap/structured-clone';

export async function getRecommendations(seed, genreSeeds){

    if (seed == "NA"){
        return -1;
    }

    var totalSeed = structuredClone(seed);
    totalSeed.push("seed_genres=" + genreSeeds.toLowerCase())

    var targetURL = "http://localhost:9000/getSongs/v2?" + totalSeed.join("&");
    
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

export async function createPlaylist (playlistURIs, accessToken) {
    // const redirectURL = "http://localhost:3000/album";
    // var authURL = `http://localhost:9000/playlist/callback?redirect=${redirectURL}`;
    // var accessToken =  await fetch(authURL);

    console.log(accessToken)

    var createPlaylistURL = "http://localhost:9000/playlist/createPlaylist?accessToken=" + accessToken;
    var playlistPayload = await fetch(createPlaylistURL);
    playlistPayload = await playlistPayload.json()
    console.log(playlistPayload)

    var playlistID = playlistPayload["id"]
    var uris= playlistURIs.join(",")
    var addToPlaylistURL = `http://localhost:9000/playlist/addToPlaylist?accessToken=${accessToken}&playlist_id=${playlistID}&uris=${uris}`;
    
    var addToPlaylistPayload = await fetch(addToPlaylistURL);

    return playlistPayload["external_urls"]["spotify"];
}

export const recommendationToString = (resultObject) => {
    return resultObject["name"] + " by " + resultObject["artists"][0]["name"];
}