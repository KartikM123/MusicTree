import React from 'react';

import '../StyleSheets/ComponentSheets/AlbumResults.css';

import DynamicGraph from './Utils/DynamicGraph';

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        //used for recommendation engine
        this.state = {
            clickHandler: '',
            clickHandler: undefined,
            ...this.props.location.state
        }

        this.printClickHandler = this.printClickHandler.bind(this)
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
        return (
            <div>
                <button onClick={this.printClickHandler}>
                    toggle {this.state.clickHandler == undefined ? 'print' : 'populate'}
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
