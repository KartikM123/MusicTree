import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import { Link } from 'react-router-dom';

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

        return (
            <div>
                <ul>
                    {moods.map((value,index) => {
                        console.log(value);
                       return  (<li>
                           {value}
                           </li>);
                    })}
                </ul>
                <Link to = {{pathname: '/album',
                    state: this.state
                    }} > See Album !!</Link>  
            </div>
        )

    }
}
export default Mood_Result;