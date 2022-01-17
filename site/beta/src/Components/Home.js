import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { images } from './getImages';
import '../StyleSheets/ComponentSheets/Home.css'
import '../StyleSheets/general.css'

export class HomePage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            title: "Sample Title",
            username: "none",
            usernameInput: false
        }
    }

    render () {
        return (
            <div className="main" >
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
                <img className="logoLarge"src={images["./MainPageLogo.svg"]} />
                <p className="subtitle">The Music Tree determines your music personality and provides you with new listening recommendations based on your results. 
                    <br/> <br/> Click below to get started. </p>
                <div className="center">
                        <Link className="nextbutton" to="/survey">Go to Survey</Link>
                </div>
            </div>
        );
    }

    

}
export default HomePage;
