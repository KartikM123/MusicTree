export function albumTraitMatch(moods, albumInfo) {
    var traits = albumInfo["traits"];
    var isCorrect = true;
    for (var m in ratingMoods)
    {
        var moods = ratingMoods[m];
        if (!traits.includes(moods))
        {
            isCorrect = false;
        }
    }
    if (isCorrect)
    {
        //console.log("Identified seed album as " + album);
        res.seed_artists = albumInfo["seed_artists"];
        res.seed_tracks = albumInfo["seed_tracks"];
        res.seed = album;
        return res;
    }

    // undefined if they are not a match
    return undefined;
}