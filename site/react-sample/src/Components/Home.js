export class HomePage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            title: "Sample Title",
            username: "none",
            usernameInput: false
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

    updateUsername(){
        let username = this.state.username;
        if (this.state.username != null){
            this.setState((state) => {
                state.usernameInput = true;
            });
        }
        this.forceUpdate();
    }

    render () {
        if (this.state.usernameInput){ 
            return (
                <div>
                    <h1>Welcome to Music Tree</h1>
                    <p>Nice to meet you {this.state.username}</p>
                    <a href="">Go to Survey</a>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>Welcome to Music Tree</h1>
                    <h2>Please input your username</h2>
                    <TextInput
                    ref= "username"
                    value="Test"
                    onChangeText={(username) => this.setState((state) => {state.username = username})}
                    />
                    <button>Submit Username</button>
                </div>
            );
        } 
    }

    

}
export default HomePage;
