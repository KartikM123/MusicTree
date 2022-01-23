import React from 'react';
import question_map from '../Question_Data/questions.json'
import genresAll from '../Question_Data/SupportedGenres.json'
import { Link } from 'react-router-dom';
import { images } from './getImages';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Question } from './Utils/SurveyUtils.js'

import '../StyleSheets/general.css'
import '../StyleSheets/ComponentSheets/Survey.css'

class Survey extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            Questions: {},
            Ratings: {},
            error: false,
            questionType: '',
            currentQuestions: '',
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

        //general workflow
        this.clickN = this.clickN.bind(this);
        this.checkStateDone = this.checkStateDone.bind(this);

        // interface with questions
        this.onChange = this.onChange.bind(this);
        
        //genre
        this.renderGenrePicker = this.renderGenrePicker.bind(this);
        this.clickGenre = this.clickGenre.bind(this);
        this.isActiveGenre = this.isActiveGenre.bind(this);
    }

    onChange(q, clicked)
    {
        // read value of the question when updated
        var ques = parseInt(q);

        if (ques)
        {
            this.results[ques-1] = clicked;
            console.log(this.results);
        }
    }

    componentWillMount() {
        //read file workflow
        //only needs to be done once
        let fileTypes = []
        let questions = {}
        let ratings = {}
        for (var p in question_map){
            fileTypes.push(p)
            questions[p] = question_map[p]["Questions"]
            ratings[p] = 0;
        }
        
        this.setState((state) =>
        {
            state.Questions = questions;
            state.currentQuestions = questions[fileTypes[0]];
            state.questionType = fileTypes[0];
            state.allTypes = fileTypes;
            state.Ratings = ratings
        });
    }

    

    finishedQuestions(){

        this.setState((state) => {
            state.error = false;
            state.initCondition = true;
        });

        this.forceUpdate();
    }
    
    printRatings()
    {
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
        let test = true;
        
        if (!this.checkStateDone()){
            // Do not go next if all questionsa re not done
            this.setState((state) => {
                state.error= true
            });
        } else {

            //update rating scores and append Question
            let newType = this.state.questionType; // Type of question
            let newTypeCount = this.state.typeCount; // How many question types you have been through

            let newRatings = this.state.Ratings;
            
            //retune the results per question
            for (let i = 0; i < this.state.currentQuestions.length; i++)
            {
                if (this.state.currentQuestions[i][1] == 1)
                {
                    this.results[i] = 7 - this.results[i] + 1;
                }
            }

            
            //update results based on currentQuestions
            let totalClick = this.results.reduce((a,b) => a + b, 0); // pos, neg, pos ,neg pattern
            console.log(this.results);
            newRatings[newType] = totalClick/this.state.currentQuestions.length;

            console.log(newType + " finshed | rating: " + newRatings[newType] + " | total: " + totalClick);

            //appendType
            newTypeCount = newTypeCount + 1;
            if (newTypeCount < this.state.allTypes.length){
                newType =  this.state.allTypes[newTypeCount];
            } else {
                // finish questions right here
                this.setState((state) => {
                    state.Ratings = newRatings;
                })
                this.finishedQuestions();
                return;
            }
        
            this.setState((state) => {
                state.Ratings = newRatings; // Calculated Ratings
                state.error = false; // no error
                state.questionType = newType; // Type of Q | eg. Mind
                state.currentQuestions = state.Questions[newType]; // List of Current Qs | eg [q1,q2,q3,q4]
                state.typeCount = newTypeCount; // # of types gone through | 0 < newTypeCount < 4
            })

            this.printRatings();
            this.results = [-1,-1,-1,-1]; // reset results

            if (test){
                this.finishedQuestions();
            }

        }
        console.log("Update!");
        this.forceUpdate();
    }
    
    /* -- Consider moving all of these to a genre component -- */
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
    renderGenrePicker()
    {
        // CONSIDER MAKIGN THIS ITS OWN COMPONENT

        var keyGenres = genresAll["trimmedGenres"];

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
                            <a onClick={() => root.clickGenre(genre)} className="genreOption" style={{backgroundColor : root.isActiveGenre(genre) !="white" ? "green": "white", color: root.isActiveGenre(genre)== "white" ? "black" : "white"}} key={genre}> {genre} </a>
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
    /* -- End of Genre Component 0-- */

    render(){

        let albumSrc = document.createElement("div");
        
        if (this.state.initCondition) {
            return this.renderGenrePicker();
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

                <div className="questionStore">
                    <Question id = "first" questionType={this.state.questionType} change={this.onChange}   currentQuestion={this.state.currentQuestions[0][0]} uniqueId="1"/>
                    <Question id = "second" questionType={this.state.questionType} change={this.onChange}   currentQuestion={this.state.currentQuestions[1][0]} uniqueId="2"/>
                    <Question id = "third" questionType={this.state.questionType} change={this.onChange}  currentQuestion={this.state.currentQuestions[2][0]} uniqueId="3"/>
                    <Question id = "fourth" questionType={this.state.questionType} change={this.onChange}  currentQuestion={this.state.currentQuestions[3][0]} uniqueId="4"/>
                </div>
                <div className="centerDiv">
                <a onClick={() => this.clickN()} >Next Set</a>
                </div>
            </div>
        )
    }
}
export default Survey;
