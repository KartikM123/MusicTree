import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import avatar_map from '../Question_Data/AvatarMapping.json'
import { Link } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar'
import '../StyleSheets/styles.css'
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('../', '')] = r(item); });
    console.log(images)
    console.log(r)
    return images;
  }
  
  const images = importAll(require.context('../pngavatars', false, /\.(png|jpe?g|svg)$/));
class Bar extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            category: this.props.category, //ex. Mind,Energy,Romance
            rating: this.props.rating, //1-5 value
            value: this.props.value ,
            description: question_map[this.props.category]["Description"],
            color: this.props.color
        }

    }

    render()
    {
        let posColor = "black";
        let negColor = "black";

        if (question_map[this.state.category]["Positive"] == this.state.rating)
        {
            posColor = this.props.color;
            console.log("HERE!")
        } else 
        {
            negColor = this.props.color;
            console.log("HERE!")
        }
        return (
        <div className="bar" >
            <p className = "barCategory">{this.state.category}</p>
            <p className = "description">{this.state.description} </p>
            <ProgressBar variant={this.props.variant} now={this.state.value*20} label={`${this.state.value*20}%`} />
            
            <div className = "positiveBar"   style = {{color: posColor}}> {question_map[this.state.category]["Positive"]} </div>

            <div className = "negativeBar"  style = {{color: negColor}}> {question_map[this.state.category]["Negative"]} </div>
            
            <br />
        </div>
        );

    }

}
class BarContainer extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            ratingMoods: this.props.ratingMoods
        }
        
    }

    render()
    {
        return (
            <div className="barcontainer">
                <Bar color="#426F71" variant="info" category="Mind" rating={this.state.ratingMoods["Mind"]["rating"]} value={this.state.ratingMoods["Mind"]["value"]}></Bar>

                <Bar color="#DBAA55" variant= "warning" category="Energy" rating={this.state.ratingMoods["Energy"]["rating"]} value={this.state.ratingMoods["Energy"]["value"]}></Bar>

                <Bar color="#826673" variant="danger" category="Romance" rating={this.state.ratingMoods["Romance"]["rating"]} value={this.state.ratingMoods["Romance"]["value"]}></Bar>

                <Bar color="#9CC7A9" variant="success" category="Knowledge" rating={this.state.ratingMoods["Knowledge"]["rating"]} value={this.state.ratingMoods["Knowledge"]["value"]}></Bar>

            </div>
        )
    }
}
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
                <h1 className= "avatarName" >{avatar}</h1>
                <div >
                    <img className= "avatarImg" src={images["./" + idealImage]} />
                    <div className = "overlay">
                        </div>
                </div>
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
            ratingMoods[key] = {}
            ratingMoods[key]["value"] = this.state.Ratings[key];
            if (this.state.Ratings[key] > 3){
                ratingMoods[key]["rating"] = question_map[key]["Positive"];
            } else {
                ratingMoods[key]["rating"] = question_map[key]["Negative"];
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
                <div className="banner">
                    Banner placeholder
                </div>
                <link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
  integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
  crossorigin="anonymous"
/>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

                <div className="leftSide">
                <p className="personalityHeader"> Your music personality is : </p>

                <div id="avatarContainer">
                    <Avatar ratingMoods={moodsMap}/>
                </div>

                </div>
                <div className="rightSide">
                    <BarContainer ratingMoods={moodsMap} />
                    {/* <div id="moodsContainer">
                        <ul>
                            {moods.map((value,index) => {
                                console.log(value);
                            return  (<li>
                                {value}
                                </li>);
                            })}
                        </ul>
                    </div> */}

                <div id="LinkContainer">
                    <Link to = {{pathname: '/album',
                        state: this.state
                        }} > See Album !!</Link>  
                </div>
                </div> 
            </div>
        )

    }
}
export default Mood_Result;