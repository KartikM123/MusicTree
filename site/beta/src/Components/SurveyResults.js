import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import avatar_map from '../Question_Data/AvatarMapping.json'
import { Link } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar'
import '../StyleSheets/general.css'
import '../StyleSheets/ComponentSheets/MoodResults.css'
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('../', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('../pngavatars/gifs/', false, /\.(gif|jpe?g|svg)$/));
  const writeups = importAll(require.context('../writeups', false, /\.(txt)$/));

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
        } else 
        {
            negColor = this.props.color;
        }
        return (
        <div className="bar" >
            <p className = "barCategory">{this.state.category}</p>
            <p className = "description">{this.state.description} </p>
            <ProgressBar variant={this.props.variant} now={this.state.value*10} label={`${this.state.value*10}%`} />
            
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
            var isCorrect = true;
            for (var moods in usedKeys){
                var mood = ratingMoods[usedKeys[moods]]
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                this.setState((state) =>
                {
                    state.avatar = avatar;
                    state.avatarImg = avatar_map[avatar]["photoPath"];
                });

                this.forceUpdate();
                return;
            }
        }

        return "No album";
    }

    // async getAvatarDescription(avatar) {
    //     let avatarPath = avatar.split(".")[0] + ".txt"; //<name>.gif ==> <name>.txt

    //     let f = await fetch(writeups[`./${avatarPath}`]);
    //     let totext = await f.text();

    //     // prettyPrintText
    //     let paragraphComponents = totext.split("|");
    //     let renderedBody = (
    //         <div>
    //         <p> {paragraphComponents[0]}</p>
    //         <br/>
    //         <p className='highlight'> {paragraphComponents[1]} </p>
    //         <br />
    //         <p> {paragraphComponents[2]} </p>
    //         </div>
    //     );
    //     this.props.avatarRef.current = renderedBody;
    // }

    render(){
        var albumName  = "";
        var ratingMoods = this.props.ratingMoods;
        var usedKeys = ["Mind","Energy","Romance"]
        for (var avatar in avatar_map){
            var traits = avatar_map[avatar]["Mood"];
            var isCorrect = true;
            for (var moods in usedKeys){
                var mood = ratingMoods[usedKeys[moods]]
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                break;
            }
        }
        let idealImage = avatar_map[avatar]["photoPath"].split("/")[3]
        this.props.setAvatarDescription(idealImage);
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
export class Survey_Result extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Ratings: {},
            allTypes: [],
            typeCount: 0,
            questionCount: 0,
            initCondition: false,
            imgUrl: 'None!',
            avatarTextRef: undefined
        }
        this.state = this.props.location.state;
        this.getRatingMoods = this.getRatingMoods.bind(this);
        this.setAvatarDescription = this.setAvatarDescription.bind(this);
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

    async setAvatarDescription(avatar) {
        if (this.state.avatarTextRef != undefined)
        {
            return;
        }

        let avatarPath = avatar.split(".")[0] + ".txt"; //<name>.gif ==> <name>.txt

        let f = await fetch(writeups[`./${avatarPath}`]);
        let totext = await f.text();
        this.setState(() =>
        {
            return {
                avatarTextRef : totext
            }
        });
    }

    render() {
        let moods = this.toArr(this.getRatingMoods());
        console.log(this.state.avatarTextRef)
        let refBody = <div></div>
        if (this.state.avatarTextRef != undefined)
        {
            let totext = this.state.avatarTextRef;

            // prettyPrintText
            let paragraphComponents = totext.split("|");
            refBody = (
                <div>
                <p> {paragraphComponents[0]}</p>
                <br/>
                <p className='highlight'> {paragraphComponents[1]} </p>
                <br />
                <p> {paragraphComponents[2]} </p>
                </div>
            );
            console.log("HERE")
        }
        let moodsMap = this.getRatingMoods();

        return (
            <div className="Mood_Result">
                <div className="banner">
                    <img className="bannerLogo"src={images["./miniLogo.svg"]} />
                    <img className ="bannerText" src ={images["./bText.svg"]} />
                </div>
                <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
                        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
                        crossorigin="anonymous"
                        />
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

                <div className="parentBox">
                    <div className="leftSide">
                        <p className="personalityHeader"> Your music personality is : </p>

                        <div id="avatarContainer">
                            <Avatar ratingMoods={moodsMap} setAvatarDescription={this.setAvatarDescription}/>
                        </div>

                    </div>
                    <div className="rightSide">
                        <BarContainer ratingMoods={moodsMap} />
                    </div>                  
                </div>          
                <div className="avatarDescription" >
                    {refBody}
                </div> 

                <div id="LinkContainer">
                    <Link to = {{pathname: '/genres',
                        state: this.state
                        }} > Pick your genres </Link>  
                </div>
            </div>
        )

    }
}
export default Survey_Result;