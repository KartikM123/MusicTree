import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import avatar_map from '../Question_Data/AvatarMapping.json'
import { Link } from 'react-router-dom';
import '../StyleSheets/styles.css'
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('../', '')] = r(item); });
    console.log(images)
    console.log(r)
    return images;
  }
  
  const images = importAll(require.context('../pngavatars', false, /\.(png|jpe?g|svg)$/));
  

class Avatar extends React.Component {
    constructor (props){
        super(props)
        this.state = {
            avatar: "",
            avatarImg: ""
        }
        this.getAvatar = this.getAvatar.bind(this)

        this.getAvatar();
    }

    getAvatar () {
        var albumName  = "";
        var ratingMoods = this.props.ratingMoods;
        var usedKeys = ["Mind","Energy","Romance"]
        for (var avatar in avatar_map){
            var traits = avatar_map[avatar]["Mood"];
            console.log(avatar_map[avatar]["Mood"])
            var isCorrect = true;
            for (var moods in usedKeys){
                var mood = ratingMoods[usedKeys[moods]]
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                console.log("Success!")
                this.setState((state) =>
                {
                    state.avatar = avatar;
                    state.avatarImg = avatar_map[avatar]["photoPath"];
                });
                console.log(avatar)
                console.log(this.state)
                this.forceUpdate();
                return;
            }
        }
        console.log("Failure!")

        return "No album";
    }

    render(){
        var albumName  = "";
        var ratingMoods = this.props.ratingMoods;
        var usedKeys = ["Mind","Energy","Romance"]
        for (var avatar in avatar_map){
            var traits = avatar_map[avatar]["Mood"];
            console.log(avatar_map[avatar]["Mood"])
            var isCorrect = true;
            for (var moods in usedKeys){
                var mood = ratingMoods[usedKeys[moods]]
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                console.log("Success!")
                this.setState((state) =>
                {
                    state.avatar = avatar;
                    state.avatarImg = avatar_map[avatar]["photoPath"];
                });
                console.log(avatar)
                console.log(this.state)
                break;
            }
        }
        let idealImage = avatar_map[avatar]["photoPath"].split("/")[2]

        console.log(idealImage);
        console.log(images)
        return (
            <div>
                <h1>{avatar}</h1>
                <img src={images["./" + idealImage]} />
            </div>
        )
        
    }

}
class Mood_Result extends React.Component {
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
        this.state = this.props.location.state;
        this.getRatingMoods = this.getRatingMoods.bind(this)
        this.printRatings();
    }
    printRatings(){

        console.log("Moods");
        console.log("PRINT RATINGS")
        for (var key in this.state.Ratings){
            console.log(key +": " + this.state.Ratings[key]);
        }
    }
    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
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
        if (this.isEmpty(ratingMoods)){
            console.log("Here");
            ratingMoods["Hello"] = "test";
        }
        return ratingMoods;
    }

    toArr(dict){
        let arr = [];
        for (var key in dict){
            arr.push(key);
        }
        return arr;
    }
    render() {
        let moods = this.toArr(this.getRatingMoods());
        console.log("What?")
        let moodsMap = this.getRatingMoods();

        return (
            <div className="Mood_Result">
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
                <div id="moodsContainer">
                    <ul>
                        {moods.map((value,index) => {
                            console.log(value);
                        return  (<li>
                            {value}
                            </li>);
                        })}
                    </ul>
                </div>
                <div id="avatarContainer">
                    <Avatar ratingMoods={moodsMap}/>
                </div>
                <div id="LinkContainer">
                    <Link to = {{pathname: '/album',
                        state: this.state
                        }} > See Album !!</Link>  
                </div>
            </div>
        )

    }
}
export default Mood_Result;