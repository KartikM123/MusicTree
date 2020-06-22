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
        this.getAlbum = this.getAlbum.bind(this)
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
        var allMoods = document.createElement("div");
        for (var moods in ratingMoods ){
            var mood = ratingMoods[moods];
            console.log(ratingMoods[moods]);
            var newMood = document.createElement("p");
            allMoods.appendChild(newMood.appendChild(document.createTextNode(mood)));
        }

        var album = this.getAlbum(ratingMoods);
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
        var album = this.getAlbum(ratingMoods);
        this.getAlbumImg(album);
        return;
    }
    getRatingMoods() {
        let ratingMoods = {};
        for (var key in this.state.Ratings){
            if (this.state.Ratings[key] > 3){
                ratingMoods[key] = question_map[key]["Positive"];
            } else {
                ratingMoods[key] = question_map[key]["Negative"];
            }
        }

        return ratingMoods;
    }

    getAlbum(ratingMoods){
        var albumName  = "";
        for (var album in album_map){
            var traits = album_map[album]["traits"];
            var isCorrect = true;
            for (var moods in ratingMoods){
                var mood = ratingMoods[moods]
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                return album;
            }
        }

        return "No album";
    }

    async getAlbumImg(albumName){
        var imgSrc = "";

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
