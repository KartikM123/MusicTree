import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'

//https://itnext.io/building-multi-page-application-with-react-f5a338489694

ReactDOM.render(<Survey/>, document.getElementById("survey"))

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
            initCondition: false,
            imgUrl: 'None!'
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
            state.error = "No more questions!";
            state.initCondition = true;
        })
        let albumSrc = document.createElement("div");

            var ratingMoods = this.getRatingMoods();
            var allMoods = document.createElement("div");
            for (var moods in ratingMoods ){
                var mood = ratingMoods[moods];
                console.log(ratingMoods[moods]);
                var newMood = document.createElement("p");
                allMoods.appendChild(newMood.appendChild(document.createTextNode(mood)));
            }

            var album = this.getAlbum(ratingMoods);
            console.log("Album is " + album)
            var albumName = document.createElement("div")
            albumName.appendChild(document.createTextNode(album));
            
            var img = document.createElement("img");
            if (this.state.imgUrl.includes("None!")){
                this.getAlbumImg(album);
            }
            console.log("img src is " + this.state.imgUrl);

            img.src = this.state.imgUrl;
            
            // albumSrc.appendChild(allMoods);
            // albumSrc.appendChild(albumName);
            // albumSrc.appendChild(img);

            console.log(albumSrc);
            ReactDOM.render(<img src={this.state.imgUrl} />, document.getElementById("albumArt"));
            ReactDOM.render(<div>{album}</div>, document.getElementById("albumName"));
            //ReactDOM.render(<div>{ratingMoods.map((value,index) => {return  <div>{value} </div>})}</div>, document.getElementById("allMoods"));            
        //this.forceUpdate();
        return;
    }
    printRatings(){
        console.log("PRINT RATINGS")
        for (var key in this.state.Ratings){
            console.log(key +": " + this.state.Ratings[key]);
        }
    }
    clickNext (){

        //ReactDOM.render(<div>"SOOD"</div>, document.getElementById('albumInfo'))
        //this.finishedQuestions();
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
            for (var moods in ratingMoods){
                var mood = ratingMoods[moods]
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

    async getAlbumImg(albumName){
        var imgSrc = "";

        var url = "http://localhost:9000/testAPI/?albumName=" + albumName.replace(/ /g,'');
        console.log("Start here");
        fetch(url)
        .then(res => res.text())
        .then(res => {
            imgSrc = res;
            console.log("ASYNC RETURN" + imgSrc);
            this.setState((state) => {
                state.imgUrl = imgSrc;
            });
            let albumSrc = document.createElement("div");
            imgSrc = res;
            console.log("ASYNC RETURN" + imgSrc);
            this.setState((state) => {
                state.imgUrl = imgSrc;
            });
            var ratingMoods = this.getRatingMoods();
            var allMoods = document.createElement("div");
            for (var moods in ratingMoods ){
                var mood = ratingMoods[moods];
                console.log(ratingMoods[moods]);
                var newMood = document.createElement("p");
                allMoods.appendChild(newMood.appendChild(document.createTextNode(mood)));
            }

            var album = this.getAlbum(ratingMoods);
            console.log("Album is " + album)
            var albumName = document.createElement("div")
            albumName.appendChild(document.createTextNode(album));
            
            var img = document.createElement("img");
            if (this.state.imgUrl.includes("None!")){
                this.getAlbumImg(album);
            }
            console.log("img src is " + imgSrc);

            img.src = imgSrc;

            console.log(albumSrc);
            //ReactDOM.render(albumSrc, document.getElementById('albumInfo'));

            ReactDOM.render(<img src={imgSrc} />, document.getElementById("albumArt"));
            ReactDOM.render(<div>{album}</div>, document.getElementById("albumName"));
            //ReactDOM.render(<div>{ratingMoods.map((value,index) => {return  <p>{value} </p>})}</div>, document.getElementById("allMoods"));       
        });
        
    }

    
    render(){

        const range = [1,2,3,4,5];
        const chosenColor= "blue";
        const notChosenColor="red"
        let albumSrc = document.createElement("div");
        if (this.state.initCondition) {
            
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
                <div id="albumInfo">
                </div>     
                <div id="allMoods"></div>
                <div id= "albumName"> </div>
                <div id="albumArt"></div>           

            </div>
        )
    }
}
export default Survey;
