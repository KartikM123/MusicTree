import React from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from 'react-bootstrap/ProgressBar'

const disagreeStrong = "disagreeStrong"
const disagreeMed = "disagreeMed";
const disagreeLight = "disagreeLight";
const neutral = "neutral";
const agreeStrong = "agreeStrong"
const agreeMed = "agreeMed";
const agreeLight = "agreeLight";

export class ProgressBarWrapper extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <div className="pg">
                <ProgressBar variant="success" now={(this.props.value/16)*100} label={`${(this.props.value/16)*100}%`} />
            </div>
        )
    }
}
export class Question extends React.Component
{
    getTarget (clicked)
    {
        var target = "";
        switch (clicked)
        {
            case 1:
                target = disagreeStrong;
                break;
            case 2:
                target = disagreeMed;
                break;
            case 3:
                target = disagreeLight;
                break;
            case 4:
                target = neutral;
                break;
            case 5:
                target = agreeLight
                break;
            case 6:
                target = agreeMed;
                break;
            case 7:
                target = agreeStrong;
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
            case 2:
            case 3:
                target = "#996767";
                break;
            case 4:
                target = "#9C9FA9";
                break;
            case 5:
            case 6:
            case 7:
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
            error : "",
            uniqueId: this.props.uniqueId
        }
        this.click = -1; 

        this.clickItem = this.clickItem.bind(this)
        this.getTarget = this.getTarget.bind(this)
        this.getColor = this.getColor.bind(this)
    }       
    componentWillReceiveProps()
    {
        
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

        //If already clicked, then white out current 
        if (clicked != -1)
        {
            var target = this.getTarget(clicked);
            document.getElementById(target).style.backgroundColor = "white";
        }

        //register new entry, set it to read values
        clicked = entry;
        this.click = clicked;
        
        this.props.change(this.state.uniqueId, entry)

        if (entry != -1)
        {
            // autofill
            var target = this.getTarget(entry);
            var color = this.getColor(entry);
            document.getElementById(target).style.backgroundColor = color;
        }
        //this.forceUpdate();

    }

    componentDidUpdate()
    {
        console.log(this.props.value);
        if (this.props.value != -1)
        {
            this.clickItem(this.props.value);
        }
    }

    renderOptions()
    {
        return (
            <div className = "options">

                    <div id= {this.state.uniqueId + "disagreeStrong"} className = "disagreeStrong borderStyle optionDefault" onClick={() => {this.clickItem(1)}}>
                    </div>

                    <div id= {this.state.uniqueId + "disagreeMed"}   className = "disagreeMed borderStyle optionDefault" onClick={() => {this.clickItem(2)}}>
                    </div>

                    <div id= {this.state.uniqueId + "disagreeLight"}   className = "disagreeLight borderStyle optionDefault" onClick={() => {this.clickItem(3)}}>
                    </div>

                    <div id= {this.state.uniqueId + "neutral"} className = "neutral borderStyle optionDefault" onClick={() => {this.clickItem(4)}}>
                    </div>

                    <div id= {this.state.uniqueId + "agreeLight"}  className = "agreeLight borderStyle optionDefault" onClick={() => {this.clickItem(5)}}>
                    </div>

                    <div id= {this.state.uniqueId + "agreeMed"}  className = "agreeMed borderStyle optionDefault" onClick={() => {this.clickItem(6)}}>
                    </div>

                    <div id= {this.state.uniqueId + "agreeStrong"} className = "agreeStrong borderStyle optionDefault" onClick={() => {this.clickItem(7)}}>
                    </div>
            
            </div>
        );
    }

    render()
    {
        let range = [1,2,3,4,5]
        let isMidClass = this.props.uniqueId == "4" ? "": " questionMid"
        return (
            <div className = {"questionWrapper" + isMidClass}>
                <div className="questionText"> {this.props.currentQuestion}</div>
                <div className="questionContent">
                    <div className= "disagree"> Disagree </div>
                    {this.renderOptions()}
                    <div className = "agree"> Agree </div>
                </div>
                {/* <p id="error"></p>        

                <p>{this.state.error}</p>         */}
            </div>
        )
    }
}