import React from 'react';
import ReactDOM from 'react-dom';

export class Title extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            title: "Sample Title"
        }
        this.goHome = this.goHome.bind(this);
    }

    goHome() {
        console.log("Home Button Pressed")
        this.setState((state) =>{
            state.title = state.title == "Updated" ? "Sample Title" : "Updated"
        })
        console.log("re render!")
        this.forceUpdate()
    }

    render () {
        return (
            <div>
                <p>{this.state.title}</p>
                <button onClick={this.goHome}> Return</button>
            </div>
        );
    }

    

}
export default Title;
