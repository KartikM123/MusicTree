import React from 'react';
import question_map from '../Question_Data/questions.json'
import genresAll from '../Question_Data/SupportedGenres.json'
import { Link } from 'react-router-dom';
import { images } from './getImages';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { ProgressBarWrapper, Question } from './Utils/SurveyUtils.js'
import { useHistory, Redirect } from 'react-router-dom';


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
            currGenre: 0,
            value: 0
        }

        this.results =  [-1,-1,-1,-1];

        //general workflow
        this.clickN = this.clickN.bind(this);
        this.checkStateDone = this.checkStateDone.bind(this);

        // interface with questions
        this.onChange = this.onChange.bind(this);


    }

    onChange(q, clicked)
    {
        // read value of the question when updated
        var ques = parseInt(q);

        if (this.results[ques-1] == -1) 
        {
            //if clicked for first time show progress bar
            this.setState(() => {
                return {
                    value: this.state.value++
                }
            })
        }

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
                console.log("done")
                // finish questions right here
                this.setState((state) => {
                    state.Ratings = newRatings;
                })
                console.log("here!")
                this.finishedQuestions();

                this.forceUpdate();
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

    render(){

        if (this.state.initCondition) {

        
            console.log("Redirect!");

            return <Redirect to={{
                pathname: '/surveyResult',
                state: this.state
            }} />
        } 
        console.log("RENDERING!");
        console.log((this.state.value/16)*10);
        return (
            <div className="Mood_Result">
            <div className="banner">
                <img className="bannerLogo"src={images["./miniLogo.svg"]} />
                <img className ="bannerText" src ={images["./bText.svg"]} />
            </div>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
                <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
                        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
                        crossorigin="anonymous"
                        />
                <ProgressBar variant="success" now={(this.state.value/16)*100} label={`${(this.state.value/16)*100}%`} />
                <div className="questionStore">
                    <Question id = "first" questionType={this.state.questionType} change={this.onChange}   currentQuestion={this.state.currentQuestions[0][0]} value={this.results[0]} uniqueId="1"/>
                    <Question id = "second" questionType={this.state.questionType} change={this.onChange}   currentQuestion={this.state.currentQuestions[1][0]} value={this.results[1]} uniqueId="2"/>
                    <Question id = "third" questionType={this.state.questionType} change={this.onChange}  currentQuestion={this.state.currentQuestions[2][0]} value={this.results[2]} uniqueId="3"/>
                    <Question id = "fourth" questionType={this.state.questionType} change={this.onChange}  currentQuestion={this.state.currentQuestions[3][0]} value={this.results[3]} uniqueId="4"/>
                </div>
                <div className="centerDiv">
                <a onClick={() => this.clickN()} >Next Set</a>
                </div>
            </div>
        )
    }
}
export default Survey;
