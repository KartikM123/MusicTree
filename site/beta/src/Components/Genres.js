import React from 'react';
import question_map from '../Question_Data/questions.json'
import genresAll from '../Question_Data/SupportedGenres.json'
import { Link } from 'react-router-dom';
import { images } from './getImages';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Question } from './Utils/SurveyUtils.js'

import '../StyleSheets/general.css'
import '../StyleSheets/ComponentSheets/Survey.css'
export class Genre_Page extends React.Component 
{
    constructor(props)
    {
        super(props)
        this.state = this.props.location.state;
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
                state.error = false;
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

    render()
    {
        // CONSIDER MAKING THIS ITS OWN COMPONENT

        var keyGenres = genresAll["trimmedGenres"];

        var finalPart =  <a> See Your Persona </a>;
        if (this.state.currGenre > 2){
            finalPart =  <Link to = {{pathname: '/album', state: this.state}} > See Your Persona </Link>  
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
}
export default Genre_Page;