import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'

import '../StyleSheets/ComponentSheets/AlbumResults.css';
import '../StyleSheets/general.css';
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
        this.renderChild = this.renderChild.bind(this)
        this.reseedOnClick = this.reseedOnClick.bind(this)

        //used for recommendation engine
        this.getSeeds = this.getSeeds.bind(this)
        this.getRecommendations = this.getRecommendations.bind(this)
        this.getAlbumImg = this.getAlbumImg.bind(this)
        this.state = this.props.location.state;

    }

    async rerenderWorkflow()
    {
        var ratingMoods = this.getRatingMoods();
        var seed = this.getSeeds(ratingMoods);

        this.renderWithSeeds(ratingMoods, seed, undefined);
    }


    async renderWithSeeds(ratingMoods, seed, albumRec)
    {

        var genres = this.state.genre;
        var seed = this.getSeeds(ratingMoods);
        if (albumRec == undefined)
        {
            albumRec = await this.getRecommendations(seed,ratingMoods, genres);
            console.log(albumRec["name"]);
        }
        var recommendation = albumRec["name"] + " by " + albumRec["artists"][0]["name"];
        console.log("Album is " + recommendation);

        var imgUrl = await this.getAlbumImg(albumRec);

        ReactDOM.render(<img src={imgUrl} />, document.getElementById("albumArt"));
        ReactDOM.render(<div>{recommendation}</div>, document.getElementById("albumName"));
 
        await this.renderChild(seed, 1, genres, albumRec);
        await this.renderChild(seed, 2, genres, albumRec);
        await this.renderChild(seed, 3, genres, albumRec);
    }

    async renderChild(seed, num, genres, parentRec)
    {


        var ratingMoods = this.getRatingMoods();
        var albumRec = await this.getRecommendations(seed, ratingMoods, genres[num-1]);
        console.log(albumRec["name"])
        var recommendation = albumRec["name"] + " by " + albumRec["artists"][0]["name"];
        console.log("Album is " + recommendation);

        var imgUrl = await this.getAlbumImg(albumRec);
        ReactDOM.render(<img onClick={() => {this.reseedOnClick(parentRec, albumRec)} } src={imgUrl} />, document.getElementById("albumArt" + num));
        ReactDOM.render(<div >{recommendation} + {genres[num-1]}</div>, document.getElementById("albumName" + num));
    }

    reseedOnClick = (parentRec, albumRec) =>
    {
        var seed = {
            "seed": albumRec["name"],
            "seed_artists": "",
            "seed_tracks": ""
        }        

        var ratingMoods = this.getRatingMoods();
        
        seed.seed_artists = parentRec["artists"][0]["id"] + "," + albumRec["artists"][0]["id"];
        seed.seed_tracks = parentRec["id"] + "," + albumRec["id"];

        this.renderWithSeeds(ratingMoods, seed, albumRec);
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

    async getRecommendations(seed, ratingMoods, genreSeeds){

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
                <div className="albumParent">
                    <div id= "albumName"> </div>
                    <div id="albumArt" className="albumArt"></div>   
                </div>
                <div className="albumChildren">
                    
                    <div id="albumChild1" className="albumChild">
                        <div id= "albumName1" className="child1"></div>
                        <div id="albumArt1" className="albumArt"></div>   
                    </div>
                    <div id="albumChild2" className="albumChild">
                        <div id= "albumName2" className="child2"></div>
                        <div id="albumArt2" className="albumArt"></div>   
                    </div>

                    <div id="albumChild3" className="albumChild">
                        <div id= "albumName3" className="child3"></div>
                        <div id="albumArt3" className="albumArt"></div>   
                    </div>
                </div>
            </div>
        )
    }
}
export default Album_Result;
