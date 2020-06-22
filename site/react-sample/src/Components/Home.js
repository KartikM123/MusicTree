import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

export class HomePage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            title: "Sample Title",
            username: "none",
            usernameInput: false
        }
        this.state=this.props.state;
        this.goHome = this.goHome.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
    }

    goHome() {
        console.log("Home Button Pressed")
        this.setState((state) =>{
            state.title = state.title == "Updated" ? "Sample Title" : "Updated"
        })
        console.log("re render!")
        this.forceUpdate()
    }

    updateUsername(e){
        let username = this.state.username;
        if (username != null){
            this.setState((state) => {
                state.usernameInput = true;
            });
        } else {
            console.log("Sus!");
        }
        this.forceUpdate();
    }

    render () {
        if (this.state.usernameInput){ 
            return (
                <div>
                    <h1>Welcome to Music Tree</h1>
                    <p>Nice to meet you {this.state.username}</p>
                    <Link to="/survey">Go to Survey</Link>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>Welcome to Music Tree</h1>
                    <h2>Please input your username</h2>
                    <input
                    type= "text"
                    value={this.state.username}
                    onChange={(event) => this.setState({username: event.target.value})}
                    />
                    <button onClick={this.updateUsername}>Submit Username</button>
                </div>
            );
        } 
    }

    

}
export default HomePage;
