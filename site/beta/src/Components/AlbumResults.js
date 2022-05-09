import React from 'react';

import '../StyleSheets/ComponentSheets/AlbumResults.css';
import '../StyleSheets/general.css';

import DynamicGraph from './Utils/DynamicGraph';

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        //used for recommendation engine
        this.state = {
            ...this.props.location.state
        }

    }

    render() {
        return (
            <div>
                <div>
                <DynamicGraph 
                    ratings={this.props.location.state.Ratings}
                    genre={this.state.genre}                    />
                </div>
            </div>
        )
    }
}
export default Album_Result;
