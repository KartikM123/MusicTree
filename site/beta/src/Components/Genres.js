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
        this.state.genre = [];

        this.clickGenre = this.clickGenre.bind(this);
        this.isActiveGenre = this.isActiveGenre.bind(this);
    }
    clickGenre(genre)
    {
        if (this.isActiveGenre(genre) != "white")
        {
            //deactivation workflow
            var target = 0;

            var newGenreList = [];
            for(let i = 0; i < this.state.genre.length; i++)
            {
                if (this.state.genre[i] != genre)
                {
                    newGenreList.push(this.state.genre[i]);
                }
            }

            this.setState((state) => {
                state.genre = newGenreList;
                state.error = false;
            });
        } else if (this.state.genre.length > 2)
        {
            //should not be clicking a new genre at this point
            this.setState((state) => {
                state.error = true;
            });
        } else
        {
            var newGenreList = this.state.genre;
            newGenreList.push(genre);
            this.setState((state) => {
                state.error = false;
                state.genre = newGenreList;
            });
        }
        this.forceUpdate();
    }

    isActiveGenre(genre)
    {
        if (this.state.genre.includes(genre))
        {
            return "green";
        }
        return "white";
        
    }

    render()
    {
        // CONSIDER MAKING THIS ITS OWN COMPONENT

        var keyGenres = genresAll["trimmedGenres"];

        var finalPart =  <a> See Your Results </a>;
        if (this.state.genre.length > 2){
            finalPart =  <Link to = {{pathname: '/album', state: this.state}} > See Your Results </Link>  
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
                            <a onClick={() => root.clickGenre(genre)} className="genreOption" style={{backgroundColor : root.isActiveGenre(genre), color: root.isActiveGenre(genre)== "white" ? "black" : "white"}} key={genre}> {genre} </a>
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