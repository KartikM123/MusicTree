import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import genresAll from '../Question_Data/SupportedGenres.json'
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { images } from './getImages';
import ProgressBar from 'react-bootstrap/ProgressBar'

import '../StyleSheets/general.css'
import '../StyleSheets/ComponentSheets/Survey.css'


class Question extends React.Component
{
    getTarget (clicked)
    {
        var target = "";
        switch (clicked)
        {
            case 1:
                target = "one";
                break;
            case 2:
                target = "two";
                break;
            case 3:
                target = "three";
                break;
            case 4:
                target = "four";
                break;
            case 5:
                target = "five";
                break;
            default:
                target = "unkwn";
                console.log("Unknwown previous entry");
                break;
        }
        return this.state.uniqueId + target;
    }
    getColor (entry)
    {
        var target = "";
        switch (entry)
        {
            case 1:
                target = "#996767";
                break;
            case 2:
                target = "#996767";
                break;
            case 3:
                target = "#9C9FA9";
                break;
            case 4:
                target = "#9CC7A9";
                break;
            case 5:
                target = "#9CC7A9";
                break;
            default:
                target = "black";
                console.log("Unknwown previous entry");
                break;
        }
        return target;
    }
    constructor(props)
    {
        super(props);
        var q = this.props.currentQuestion;
        this.state = {
            questionType : this.props.questionType,
            currentQuestion : q,
            weight : this.props.weight,
            error : "",
            uniqueId: this.props.uniqueId
        }
        this.click = -1; 
        console.log("Current quetsion");
        console.log(this.props.currentQuestion);
        console.log(this.props)

        this.clickItem = this.clickItem.bind(this)
        this.getTarget = this.getTarget.bind(this)
        this.getColor = this.getColor.bind(this)
    }       
    componentWillReceiveProps()
    {
        console.log("here!");
        var clicked = this.click;
        if (clicked != -1)
        {
            var target = this.getTarget(clicked);
            document.getElementById(target).style.backgroundColor = "white";
        }
        this.forceUpdate();
    }
    
    clickItem(entry) {
        var clicked = this.click;
        if (clicked != -1)
        {
            var target = this.getTarget(clicked);
            document.getElementById(target).style.backgroundColor = "white";
        }
        clicked = entry;
        this.click = clicked;
        console.log(this.props);
        this.props.change(this.state.uniqueId, entry)
        if (entry != -1)
        {
            var target = this.getTarget(entry);
            console.log(target);
            var color = this.getColor(entry);
            document.getElementById(target).style.backgroundColor = color;
        }
        this.forceUpdate();

    }

    render()
    {
        let range = [1,2,3,4,5]
        return (
            <div className = "question">
                {/* <h1>{this.props.questionType}</h1> */}
                <div className="q"> {this.props.currentQuestion}</div>
                <div className="rangeWrapper">
                    <div className= "disagree"> Disagree </div>
                    <div className = "options">
                        <div className = "optionWrapper">
                            <div id= {this.state.uniqueId + "one"} className = "one borderStyle" onClick={() => {this.clickItem(1)}}>
                            </div>
                        </div>

                        <div className = "optionWrapper">
                            <div id= {this.state.uniqueId + "two"}   className = "two borderStyle" onClick={() => {this.clickItem(2)}}>
                            </div>
                        </div>

                        <div className = "optionWrapper"  >
                            <div id= {this.state.uniqueId + "three"} className = "three borderStyle" onClick={() => {this.clickItem(3)}}>
                            </div>
                        </div>

                        <div className = "optionWrapper">
                            <div id= {this.state.uniqueId + "four"}  className = "four borderStyle" onClick={() => {this.clickItem(4)}}>
                            </div>
                        </div>

                        <div className = "optionWrapper">
                            <div id= {this.state.uniqueId + "five"} className = "five borderStyle" onClick={() => {this.clickItem(5)}}>
                            </div>
                        </div>
                    </div>
                    
                    <div className = "agree"> Agree </div>
                </div>
                {/* <p id="error"></p>        

                <p>{this.state.error}</p>         */}
            </div>
        )
    }
}

class ListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            imgSrc: ''
        }

        this.updateColor = this.updateColor.bind(this);
    }

    updateColor(){
        return
        this.setState((state) => {
            state.color = state.color == "blue" ? "red" : "blue";
        });
        console.log(this.state.color);
        this.forceUpdate();
    }

    render (){
        return (
            <li>
                <div onClick={this.updateColor} className={this.props.val}  >{this.props.val}</div>
            </li>
        )
    }
}


class Survey extends React.Component {
    
    constructor(props) {
        super(props)
        /* important syntax
            Question = {QuestionType: CurrentQuestion}
            Ratings = {QuestionType: Score}
            CurrentQuestion = Question[questionType][count]
            QuestionTypes = allTypes[typeCount]

            NEED TO POPULATE:
            Questions
            allTypes

            NEED TO UPDATE:
            Ratings
            typeCount
            questionCount
        */
        this.state = {
            Questions: {},
            Ratings: {},
            error: false,
            questionType: '',
            currentQuestion: '',
            clicked: -1,
            allTypes: [],
            typeCount: 0,
            questionCount: 0,
            initCondition: false,
            value: 0,
            imgUrl: 'None!',
            genre: ["","",""],
            currGenre: 0
        }

        this.results =  [-1,-1,-1,-1];
        this.clickN = this.clickN.bind(this);
        this.checkStateDone = this.checkStateDone.bind(this);
        this.onChange = this.onChange.bind(this);
        this.finalSurveyRender = this.finalSurveyRender.bind(this);
        this.clickGenre = this.clickGenre.bind(this);
        this.isActiveGenre = this.isActiveGenre.bind(this);
    }

    onChange(q, clicked)
    {
        console.log("Change Triggered");
        var ques = -1;
        switch (q){
            case "uno":
                ques = 1;
                break;
            case "dos":
                ques = 2;
                break;
            case "tres":
                ques = 3;
                break;
            case "cuatro":
                ques = 4;
                break;
            default:
                ques = -1
                console.log("invalid onChange event");
                break;
        };

        console.log(ques);
        if (ques)
        {
            let res = this.results;
            res[ques-1] = clicked;
            console.log(clicked);
            console.log(res);
            this.results = res;

            console.log(this.results);
        }
    }

    readFile() {
        console.log("Reading file");
        let fileTypes = []
        for (var p in question_map){
            fileTypes.push(p)
            console.log(question_map[p])
        }
        console.log(fileTypes)
    }

    componentWillMount() {
        console.log("componnet did mount");
        //read file workflwo
        console.log(question_map)
        let fileTypes = []
        let questions = {}
        let ratings = {}
        for (var p in question_map){
            fileTypes.push(p)
            questions[p] = question_map[p]["Questions"]
            ratings[p] = 0;
        }
        console.log(fileTypes)
        console.log(questions)
        
        this.setState((state) =>
        {
            state.Questions = questions;//{"TempType": ["First Question", "Second Question"], "SecondType": ["NewType1", "NewType2"]}
            state.currentQuestion = questions[fileTypes[0]];
            state.questionType = fileTypes[0];
            state.allTypes = fileTypes;
            state.Ratings = ratings
        });
        //this.forceUpdate();
    }

    

    finishedQuestions(){

        console.log("Finished Questions!!");

        this.setState((state) => {
            state.error = false;
            state.initCondition = true;
        });

       // document.getElementById("nextButton").innerHTML = "See my Results!"
        // document.getElementById("error").innerHTML = "<Link to= \"/mood\">See my Results! </Link>"
        this.forceUpdate();
    }
    printRatings(){
        console.log("PRINT RATINGS")
        for (var key in this.state.Ratings){
            console.log(key +": " + this.state.Ratings[key]);
        }
    }

    checkStateDone()
    {
        return !(this.results[0] == -1 ||
            this.results[1] == -1 ||
            this.results[2] == -1 ||
            this.results[3] == -1 );
    }
    clickN (){
        let questions = {}
        let ratings = {}
        for (var p in question_map){
            questions[p] = question_map[p]["Questions"]
        }

        console.log(this.results);

        console.log("next questions")
        let test = true;
        if (this.state.initCondition){
            console.log("Redirect!");
            const history = useHistory();
            history.push('/');
            return;
        }
        //ReactDOM.render(<div>"SOOD"</div>, document.getElementById('albumInfo'))
        //this.finishedQuestions();
        if (!this.checkStateDone()){
            this.setState((state) => {
                state.error= true
            });
        } else {

            //update rating scores and append Question
            let newQCount = this.state.questionCount;
            let newType = this.state.questionType;
            let newTypeCount = this.state.typeCount;
            let nextQuestion = "";

            let newRatings = this.state.Ratings;
            let totalClick = (5-this.results[0]) + this.results[1] + (5-this.results[2]) + this.results[3];
            newRatings[newType] = ((newRatings[newType] * newQCount) + totalClick)/(4);


            newTypeCount = newTypeCount + 1;
            if (newTypeCount < this.state.allTypes.length){
                newType =  this.state.allTypes[newTypeCount];
            } else {
                this.setState((state) => {
                    state.Ratings = newRatings;
                })
                this.finishedQuestions();
                return;
            }

            console.log('queiing!')
            console.log(newType)
            console.log(newTypeCount)
            console.log(this.state.Questions)

        

            this.setState((state) => {
                state.Questions = state.Questions;
                state.Ratings = newRatings;
                state.error = false;
                state.questionType = newType;
                state.currentQuestion = state.Questions[newType];
                state.clicked = -1;
                state.typeCount = newTypeCount;
                state.questionCount = newQCount;
            })
            this.printRatings();
            this.results = [-1,-1,-1,-1]

            if (test){
                this.finishedQuestions();
            }

        }
        console.log("Update!");
        this.forceUpdate();
    }
    
    clickGenre(genre)
    {
        console.log("clck!")
        if (this.isActiveGenre(genre) != "white")
        {
            //deactivation workflow
            var target = 0;
            switch (this.isActiveGenre(genre)){
                case "blue":
                    target = 0;
                    break;
                case "green":
                    target = 1;
                    break;
                case "cyan":
                    target = 2;
                    break;
                default:
                    target = -1;
                    break;
            }
            this.setState((state) => {
                state.genre[target] = "";
                state.error = false
            });
            
            if (this.state.currGenre > target)
            {
                this.setState((state) => {
                    state.currGenre = target;
                });            
            }
        } else if (this.state.currGenre > 2)
        {
            this.setState((state) => {
                state.error = true;
            });
        } else
        {
            var nextGenre = 3;
            if (this.state.genre[0] == "" && this.state.currGenre != 0)
            {
                nextGenre = 0;

            } else if (this.state.genre[1] == "" && this.state.currGenre != 1)
            {
                nextGenre = 1;
            } else if (this.state.genre[2] == "" && this.state.currGenre != 2)
            {
                nextGenre = 2;
            } else {
                nextGenre = 3;
            }
            this.setState((state) => {
                state.error = false;
                state.genre[state.currGenre] = genre;
                state.currGenre = nextGenre;
            });
            console.log("here")
            console.log(this.state.currGenre);
        }
        console.log(this.state.genre);
        this.forceUpdate();
    }

    isActiveGenre(genre)
    {
        if (genre == this.state.genre[0])
        {
            return "blue";
        } else if (genre == this.state.genre[1])
        {
            return "green";
        } else if (genre == this.state.genre[2])
        {
            return "cyan";
        }

        return "white";
        
    }
    finalSurveyRender()
    {
        var keyGenres = genresAll["genres"];//[ "classical", "country", "dance", "edm", "folk",  "hip-hop", "indie", "r-n-b", "rock" ]

        var finalPart =  <a>See Stats!!</a>;
        if (this.state.currGenre > 2){
            finalPart =  <Link to = {{pathname: '/moods', state: this.state}} >See Stats!!</Link>  
        }

        var root = this;

        var finalQHeadliner = <div className="finalQ"> Pick your three favorite genres. </div>;
        if (this.state.error)
        {
            finalQHeadliner = <div className="finalQ"> Pick your <b>three</b> favorite genres. </div>;
        }
        return (
            <div className="Mood_Result">
                <div className="banner">
                    <img className="bannerLogo"src={images["./miniLogo.svg"]} />
                    <img className ="bannerText" src ={images["./bText.svg"]} />
                </div>     
                    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
                <div className="almostDone"> You're almost done... </div>
                {finalQHeadliner}
                <div className = "genreScroll">
                {
                    keyGenres.map(function(genre){
                        return (<div className="genreWrapper">
                            <a onClick={() => root.clickGenre(genre)} className="genreOption" style={{backgroundColor :root.isActiveGenre(genre), color: root.isActiveGenre(genre)== "white" ? "black" : "white"}} key={genre}> {genre} </a>
                            </div>)
                    })
                }
                </div>
                <div className="centerDiv">
                    {finalPart}
                </div>                            
            </div>
        );
    }

    render(){

        const range = [1,2,3,4,5];
        const chosenColor= "blue";
        const notChosenColor="red"
        let albumSrc = document.createElement("div");
        
        if (this.state.initCondition) {
            return this.finalSurveyRender();
        } 
        console.log("RENDERING!");
        console.log(this.state);
        return (
            <div className="Mood_Result">
            <div className="banner">
                <img className="bannerLogo"src={images["./miniLogo.svg"]} />
                <img className ="bannerText" src ={images["./bText.svg"]} />
            </div>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

                {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" /> */}
                  {/* <ProgressBar variant="info" now={this.state.value+20} label={`${this.state.value+20}%`} /> */}

                <div className="questionStore">
                    <Question id = "first" questionType={this.state.questionType} change={this.onChange}  weight = {this.state.currentQuestion[0][1]} currentQuestion={this.state.currentQuestion[0][0]} uniqueId="uno"/>
                    <Question id = "second" questionType={this.state.questionType} change={this.onChange}  weight = {this.state.currentQuestion[1][1]} currentQuestion={this.state.currentQuestion[1][0]} uniqueId="dos"/>
                    <Question id = "third" questionType={this.state.questionType} change={this.onChange} weight = {this.state.currentQuestion[2][1]} currentQuestion={this.state.currentQuestion[2][0]} uniqueId="tres"/>
                    <Question id = "fourth" questionType={this.state.questionType} change={this.onChange}  weight = {this.state.currentQuestion[3][1]} currentQuestion={this.state.currentQuestion[3][0]} uniqueId="cuatro"/>
                </div>
                <div className="centerDiv">
                <a onClick={() => this.clickN()} >Next Set</a>
                </div>
            </div>
        )
    }
}

class FinishedState extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state;
    }

    render() {
        return (
            <div className="Mood_Result">
                <Link to = {{pathname: '/moods',
                    state: this.state
                    }} >See Stats!!</Link>     
            </div>
        );
    }
};
export default Survey;
