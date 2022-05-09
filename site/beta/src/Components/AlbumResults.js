import React from 'react';

import '../StyleSheets/ComponentSheets/AlbumResults.css';
import '../StyleSheets/general.css';

import DynamicGraph from './Utils/DynamicGraph';

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        //used for recommendation engine
        this.state = {
            clickHandler: '',
            ...this.props.location.state
        }

        this.printClickHandler = this.printClickHandler.bind(this)
    }

    printClickHandler() {
        this.setState(() => {
            return ({
                clickHandler: 'print'
            });
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.printClickHandler}>
                    hi
                </button>
                <div>
                <DynamicGraph 
                    ratings={this.props.location.state.Ratings}
                    genre={this.state.genre}
                    clickHandler={this.state.clickHandler}                    />
                </div>
            </div>
        )
    }
}
export default Album_Result;
