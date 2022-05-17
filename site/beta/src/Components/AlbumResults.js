import React from 'react';

import '../StyleSheets/ComponentSheets/AlbumResults.css';
import 'react-spotify-auth/dist/index.css' // if using the included styles

import DynamicGraph from './Utils/DynamicGraph';
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import question_map from '../Question_Data/questions.json'
import queryString from 'query-string';

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        //used for recommendation engine
        let locationState = this.getLocationState();
        this.state = {
            clickHandler: '',
            clickHandler: undefined,
            ratingMoods: this.getRatingMoods(),
            ...locationState
        }

        this.printClickHandler = this.printClickHandler.bind(this)
        this.getRatingMoods = this.getRatingMoods.bind(this)
        this.getLocationState = this.getLocationState.bind(this)
        try {
            this.accessToken = queryString.parse(props.location.hash)["access_token"]
        } catch (e) {
            this.accessToken = undefined;
        }
    }

    getLocationState()
    {
        try {
            let locationState = this.props.location.state;
            if (locationState == undefined) {
                throw new Error ("don't save this")
            }
            localStorage.setItem("locationState", JSON.stringify(locationState));
            return locationState;
        } catch (e){
            return JSON.parse(localStorage.getItem("locationState"))
        }
    }

    getRatingMoods() {
        let ratingMoods = [];
        try
        {
            let Ratings = this.props.location.state.Ratings;

            for (var key in Ratings){
                if (Ratings[key] > 3){
                    ratingMoods.push(question_map[key]["Positive"]);
                } else {
                    ratingMoods.push(question_map[key]["Negative"]);
                }
            }
            localStorage.setItem("ratings", ratingMoods);
        } catch (e) {
            ratingMoods = localStorage.getItem("ratings");
            return ratingMoods;
        }

        return ratingMoods;
    }
    

    printClickHandler() {
        let newClick = undefined;
        if (this.state.clickHandler == undefined) {
            newClick = 'print'
        }
        this.setState(() => {
            return ({
                clickHandler: newClick
            });
        });
    }
    render() {
        console.log("render")
        console.log(this.accessToken);
        if (this.accessToken == undefined){
            return (<div>
            <SpotifyAuth
                redirectUri='http://localhost:3000/album'
                clientID='70577384f8d644098aac77105315ed65'
                scopes={[Scopes.playlistModifyPrivate, Scopes.playlistModifyPublic]}
            />
        </div>)
        }
        return (
            <div>
                <button onClick={this.printClickHandler}>
                    toggle {this.state.clickHandler == undefined ? 'print' : 'populate'}
                </button>
                <div>
                <DynamicGraph 
                    ratings={this.state.ratingMoods}
                    genre={this.state.genre}
                    clickHandler={this.state.clickHandler} 
                    accessToken={this.accessToken}                   />
                </div>
            </div>
        )
    }
}
export default Album_Result;
