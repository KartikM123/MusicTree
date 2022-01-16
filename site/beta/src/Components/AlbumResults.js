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
        this.rerenderWorkflow = this.rerenderWorkflow.bind(this)
        this.finishedQuestions = this.finishedQuestions.bind(this)
        this.getRatingMoods = this.getRatingMoods.bind(this)

        //used for recommendation engine
        this.getSeeds = this.getSeeds.bind(this)
        this.getRecommendations = this.getRecommendations.bind(this)
        this.getAlbumImg = this.getAlbumImg.bind(this)
        this.state = this.props.location.state;


    }

    printRatings(){

        console.log("Moods");
        console.log("PRINT RATINGS")
        for (var key in this.state.Ratings){
            console.log(key +": " + this.state.Ratings[key]);
        }
    }

    rerenderWorkflow(){
        let albumSrc = document.createElement("div");

        var ratingMoods = this.getRatingMoods();

        var album = this.getRecommendations(ratingMoods, ["rap", "rnb", "country"]);
        console.log("Album is " + album)

        var albumName = document.createElement("div")
        albumName.appendChild(document.createTextNode(album));
        
        var img = document.createElement("img");
        console.log("img src is " + this.state.imgUrl);

        img.src = this.state.imgUrl;
        
        // albumSrc.appendChild(allMoods);
        // albumSrc.appendChild(albumName);
        // albumSrc.appendChild(img);

        console.log(albumSrc);
        ReactDOM.render(<img src={this.state.imgUrl} />, document.getElementById("albumArt"));
        ReactDOM.render(<div>{album}</div>, document.getElementById("albumName"));
    }

    finishedQuestions() {
        this.printRatings();
        this.setState((state) => {
            state.initCondition = true;
        });
        var ratingMoods = this.getRatingMoods();
        var album = this.getRecommendations(ratingMoods, ["rap","rnb","country"]);
       // this.getAlbumImg(album);
        return;
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

    getRecommendations(ratingMoods, genreSeeds){

        console.log("getting seeds!")
        var seed = this.getSeeds(ratingMoods);

        if (seed.seed == "NA"){
            return -1;
        }
        var targetURL = "http://localhost:9000/getSongs/?seed_artists="+seed.seed_artists + "&seed_tracks=" + seed.seed_tracks + "&seed_genres=" + genreSeeds
        console.log("Using recommendation engine");
        fetch(targetURL)
        .then (res=> res.text())
        .then(res => {
            console.log("received message from getSongs " + res);
            //var resultObject = JSON.parse(res);
            console.log(res);
            return "done";
        })
        return "No album";
    }

    async getAlbumImg(albumName){
        var imgSrc = "";
        //TODO: Implement new imaging source
        return "";
        var url = "http://localhost:9000/testAPI/?albumName=" + albumName.replace(/ /g,'');
        console.log("Start here");
        fetch(url)
        .then(res => res.text())
        .then(res => {
            imgSrc = res;
            console.log("ASYNC RETURN" + imgSrc);
            this.setState((state) => {
                state.imgUrl = imgSrc;
            });
           this.rerenderWorkflow();    
        });
        
    }

    componentDidMount(){
        console.log("Execute Post Render");
        this.finishedQuestions();
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
