import React from 'react';
import ReactDOM from 'react-dom';
import question_map from './Question_Data/questions.json'
import album_map from './Question_Data/AlbumMapping.json'

class ListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            color:this.props.color
        }

        this.updateColor = this.updateColor.bind(this);
    }

    updateColor(){
        return
        this.setState((state) => {
            state.color = state.color == "blue" ? "red" : "blue";
        });
        console.log(this.state.color);
        this.forceUpdate();
    }

    render (){
        return (
            <li>
                <div onClick={this.updateColor} style={{backgroundColor: this.props.color}} >{this.props.val}</div>
            </li>
        )
    }
}


class Survey extends React.Component {
    
    constructor(props) {
        super(props)
        /* important syntax
            Question = {QuestionType: CurrentQuestion}
            Ratings = {QuestionType: Score}
            CurrentQuestion = Question[questionType][count]
            QuestionTypes = allTypes[typeCount]

            NEED TO POPULATE:
            Questions
            allTypes

            NEED TO UPDATE:
            Ratings
            typeCount
            questionCount
        */
        this.state = {
            Questions: {},
            Ratings: {},
            error: '',
            questionType: '',
            currentQuestion: '',
            clicked: -1,
            allTypes: [],
            typeCount: 0,
            questionCount: 0,
            initCondition: false
        }
        this.clickItem = this.clickItem.bind(this)
        this.clickNext = this.clickNext.bind(this)
    }

    readFile() {
        console.log(question_map)
        let fileTypes = []
        for (var p in question_map){
            fileTypes.push(p)
            console.log(question_map[p])
        }
        console.log(fileTypes)
    }

    componentDidMount() {
        //read file workflwo
        console.log(question_map)
        let fileTypes = []
        let questions = {}
        let ratings = {}
        for (var p in question_map){
            fileTypes.push(p)
            questions[p] = question_map[p]["Questions"]
            ratings[p] = 0;
        }
        console.log(fileTypes)
        console.log(questions)
        
        this.setState((state) =>
        {
            state.Questions = questions//{"TempType": ["First Question", "Second Question"], "SecondType": ["NewType1", "NewType2"]}
            state.currentQuestion = questions[fileTypes[0]][0];
            state.questionType = fileTypes[0];
            state.allTypes = fileTypes;
            state.Ratings = ratings
        });
        this.forceUpdate();
    }

    clickItem(entry) {
        this.setState((state) =>
        {
            state.clicked = entry;
            state.error = "";
        })

        this.forceUpdate();
    }

    finishedQuestions(){
        this.printRatings();
        this.setState((state) => {
            state.error = "No more questions!"
        })
        this.forceUpdate();
        return;
    }
    printRatings(){
        console.log("PRINT RATINGS")
        for (var key in this.state.Ratings){
            console.log(key +": " + this.state.Ratings[key]);
        }
    }
    clickNext (){
        if (this.state.clicked == -1){
            this.setState((state) => {
                state.error= "Please pick a value!"
            });
        } else {
            //update rating scores and append Question
            let newQCount = this.state.questionCount;
            let newType = this.state.questionType;
            let newTypeCount = this.state.typeCount;
            let nextQuestion = "";

            let newRatings = this.state.Ratings;
            newRatings[newType] = ((newRatings[newType] * newQCount) + this.state.clicked)/(newQCount+1);
            //console.log(this.state.questionCount)
            //console.log(this.state.Questions[this.state.questionType].length)
            if (newQCount < this.state.Questions[this.state.questionType].length-1){
                console.log("No Skipping!")
                newQCount = newQCount + 1;
                nextQuestion = this.state.Questions[this.state.questionType][newQCount]
            } else {
                //means we must go to the next question type
                newQCount = 0;

                newTypeCount = newTypeCount + 1;
                if (newTypeCount < this.state.allTypes.length){
                    newType =  this.state.allTypes[newTypeCount];
                    nextQuestion = this.state.Questions[newType][newQCount]
                } else {
                    this.setState((state) => {
                        state.Ratings = newRatings;
                    })
                    this.finishedQuestions();
                    return;
                }
            }

            this.setState((state) => {
                state.Questions = state.Questions;
                state.Ratings = newRatings;
                state.error = "";
                state.questionType = newType;
                state.currentQuestion = nextQuestion;
                state.clicked = -1;
                state.typeCount = newTypeCount;
                state.questionCount = newQCount;
            })
            this.printRatings();

        }
        this.forceUpdate();
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

        return ratingMoods;
    }

    getAlbum(ratingMoods){
        var albumName  = "";
        for (var album in album_map){
            var traits = album_map[album]["traits"];
            var isCorrect = true;
            for (var mood in ratingMoods){
                if (!traits.includes(mood)){
                    isCorrect = false;
                }
            }
            
            if (isCorrect){
                return album;
            }
        }

        return "No album";
    }

    getAlbumImg(albumName){
        // create a new XMLHttpRequest
        var xhr = new XMLHttpRequest()

        // get a callback when the server responds
        xhr.addEventListener('load', () => {
        // update the state of the component with the result here
        console.log(xhr.responseText)
        })
        // open the request with the verb and the url
        xhr.open('GET', 'https://dog.ceo/api/breeds/list/all')
        // send the request
        xhr.send()
    }

    
    render(){

        const range = [1,2,3,4,5];
        const chosenColor= "blue";
        const notChosenColor="red"
        let albumSrc = document.createElement("div");
        if (this.state.initCondition) {
            var ratingMoods = this.getRatingMoods();
            var allMoods = document.createElement("div");
            for (var mood in ratingMoods ){
                var newMood = document.createElement("p");
                allMoods.appendChild(newMood.appendChild(document.createTextNode(mood)));
            }

            var albumName = document.createElement("p").appendChild(document.createTextNode(this.getAlbum(ratingMoods)));
            
            var img = document.createElement("div");
            img.appendChild(document.createTextNode("Image todo"));
            
            albumSrc.appendChile(allMoods);
            albumSrc.appendChild(albumName);
            albumSrc.appendChile(img);

        } 
        return (
            <div>
                <h1>{this.state.questionType}</h1>
                <p> {this.state.currentQuestion}</p>
                <ul>
                    {range.map((value,index) => {
                       return  <div onClick = {() => {this.clickItem(value)}}>
                           <ListItem key={index} color={this.state.clicked == value ? chosenColor : notChosenColor} val={value}/>
                           </div>
                    })}
                </ul>
                <button onClick={this.clickNext}> Next </button>

                <p>{this.state.error}</p>
                {albumSrc}
            </div>
        )
    }
}
export default Survey;
