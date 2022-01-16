import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Ratings: {},
            allTypes: [],
            typeCount: 0,
            questionCount: 0,
            initCondition: false,
            imgUrl: 'None!'
        }
        this.rerenderWorkflow = this.rerenderWorkflow.bind(this);

        //used for recommendation engine
        this.getSeeds = this.getSeeds.bind(this)
        this.getRecommendations = this.getRecommendations.bind(this)
        this.getAlbumImg = this.getAlbumImg.bind(this)
        this.state = this.props.location.state;


    }

    async rerenderWorkflow(){
        let albumSrc = document.createElement("div");

        var ratingMoods = this.getRatingMoods();

        var albumRec = await this.getRecommendations(ratingMoods, ["rap", "rnb", "country"]);
        console.log(albumRec["name"])
        var recommendation = albumRec["name"] + " by " + albumRec["artists"][0]["name"];
        console.log("Album is " + recommendation);

        var imgUrl = await this.getAlbumImg(albumRec);
        console.log(imgUrl);

        ReactDOM.render(<img src={imgUrl} />, document.getElementById("albumArt"));
        ReactDOM.render(<div>{recommendation}</div>, document.getElementById("albumName"));
    }

    getRatingMoods() {
        let ratingMoods = [];
        for (var key in this.state.Ratings){
            if (this.state.Ratings[key] > 3){
                ratingMoods.push(question_map[key]["Positive"]);
            } else {
                ratingMoods.push(question_map[key]["Negative"]);
            }
        }
        return ratingMoods;
    }
    
    getSeeds(ratingMoods)
    {
        var albumName = "";
        var res = {
            "seed": "NA",
            "seed_artists": "",
            "seed_tracks": ""
        }
        for (var album in album_map)
        {
            var albumInfo = album_map[album];
            var traits = albumInfo["traits"];
            var isCorrect = true;
            for (var m in ratingMoods)
            {
                var moods = ratingMoods[m];
                console.log(traits + "vs" + moods);
                if (!traits.includes(moods))
                {
                    isCorrect = false;
                }
            }
            if (isCorrect)
            {
                console.log("Identified seed album as " + album);
                res.seed_artists = albumInfo["seed_artists"];
                res.seed_tracks = albumInfo["seed_tracks"];
                res.seed = album;
                return res;
            }
        }
        console.log("no seeds found!")
        return res;
    }

    async getRecommendations(ratingMoods, genreSeeds){

        console.log("getting seeds!")
        var seed = this.getSeeds(ratingMoods);

        if (seed.seed == "NA"){
            return -1;
        }
        var targetURL = "http://localhost:9000/getSongs/?seed_artists="+seed.seed_artists + "&seed_tracks=" + seed.seed_tracks + "&seed_genres=" + genreSeeds
        console.log("Using recommendation engine");
        var res =  await fetch(targetURL);
        
        var resultObject = await res.json();
        
        var recommendation = resultObject["name"] + " by " + resultObject["artists"][0]["name"];
        console.log("recommending " + recommendation);
        return resultObject;
    }

    async getAlbumImg(albumRec){
        var trackID = albumRec["id"]
        var targetURL = "http://localhost:9000/getSongs/getTrackPhoto?track_id="+trackID;
        console.log("Using recommendation engine");
        var res =  await fetch(targetURL);
        
        var resultText = await res.text();
        return resultText;
    }
        
    async componentDidMount(){
        console.log("Execute Post Render");
        await this.rerenderWorkflow();
    }
    render() {
        return (
            <div>
                <div id="albumInfo">
                </div>     
                <div id= "albumName"> </div>
                <div id="albumArt"></div>   
            </div>
        )
    }
}
export default Album_Result;
