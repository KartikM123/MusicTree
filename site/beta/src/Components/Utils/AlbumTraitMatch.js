import album_map from '../../Question_Data/AlbumMapping.json'

export function albumTraitMatch(moods, album) {
    var albumInfo = album_map[album]
    var traits = albumInfo["traits"];
    var isCorrect = true;
    var res = {};

    for (var m in moods)
    {
        var mood = moods[m];
        if (!traits.includes(mood))
        {
            isCorrect = false;
        }
    }
    if (isCorrect)
    {
        res.seed_artists = albumInfo["seed_artists"];
        res.seed_tracks = albumInfo["seed_tracks"];
        res.seed = album;
        return res;
    }

    // undefined if they are not a match
    return undefined;
}