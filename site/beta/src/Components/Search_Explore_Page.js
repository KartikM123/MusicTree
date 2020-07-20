import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import genres_supported from '../Question_Data/SupportedGenres.json'

class Search_Genre extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            genre: "",
            albumUrl: "",
            trackName: "",
            artist: ""
        };
        
        this.state.genre = this.props.genre;
        this.getRecContent = this.getRecContent.bind(this)
        this.populateGenreOptions = this.populateGenreOptions.bind(this);
        this.updateGenre = this.updateGenre.bind(this);
    }

    componentDidMount(){
        this.populateGenreOptions();
        this.getRecContent();
    }
    updateGenre(e){
        console.log("CHANGED")
        let newGenre = (document.getElementById("genreInfo").value)
        
        this.setState((state) => {
            state.genre = newGenre
        });

        console.log("updated!")
        this.forceUpdate();
        this.getRecContent();
    }
    populateGenreOptions() {
        var select = document.getElementById("genreInfo"); 
        select.addEventListener("change", this.updateGenre);
        var genres = genres_supported["genres"]; 

        for (var i = 0; i < genres.length; i++) {
            var opt = genres[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        console.log("Done!")
    }
    

    getRecContent(){
        var imgSrc = "";

        let targetAlbum = album_map[this.props.album];
        console.log("TARGET")
        console.log(album_map[this.props.album]["seed_artists"]);
        let seed_artists = targetAlbum["seed_artists"]
        let seed_tracks = targetAlbum["seed_tracks"]
        console.log(seed_artists)

        var url = `http://localhost:9000/getSongs?artists=${seed_artists}&tracks=${seed_tracks}&genre=${this.props.genre}`;
        console.log(url);
        fetch(url)
        .then(res => res.text())
        .then(res => {
            res = JSON.parse(res)
            console.log(res["album"])
            console.log(Object.keys(res))
            this.setState((state) => {
                state.albumUrl = res["album"]["images"][0]["url"];
                state.trackName = res["name"]
                state.artist = res["artists"][0]["name"]
            });
            this.forceUpdate();
        });
    }

    changeGenre(e){
        this.props.album = e;
    }

    render (){
        console.log(this.props.album)
        return (
            <div>
                <form action="/action_page.php">
                    <select id='genreInfo'>
                        
                    </select>
                </form>
                <p>{this.state.genre}</p>
                <img src={this.state.albumUrl} />
                <p>{this.state.trackName}</p>
                <p>{this.state.artist}</p>
            </div>
        )
    }
}

class Explore_Page extends React.Component {

    constructor (props){
        super(props)
        this.state = {
            album: "808s & Heartbreak - Kanye West",
        }
        //this.state = this.props.location.state;
        this.populateAlbumOptions = this.populateAlbumOptions.bind(this);
        this.childElement = React.createRef();
    }


    componentDidMount(){
        this.populateAlbumOptions();
    }


    updateAlbum(e){
        console.log("CHANGED")
        let newGenre = (document.getElementById("albumInfo").value)
        
        this.setState((state) => {
            state.genre = newGenre
        });

        console.log("updated!")
        this.forceUpdate();
        this.childElement.changeGenre(newGenre)
        //this.getRecContent();
    }

    populateAlbumOptions(){
        var select = document.getElementById("albumInfo"); 
        select.addEventListener("change", this.updateGenre);
        console.log("pouplating!")
        let allOptions = Object.keys(album_map)
        console.log(allOptions)
        
        for (var i = 0; i < allOptions.length; i++) {
            var opt = allOptions[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
    }

    render (){
        let genres = ["acoustic"];
        return (
            <div>
                <form action="/action_page.php">
                    <select id='albumInfo'>
                        
                    </select>
                </form>
                <Search_Genre ref={this.childElement} genre="acoustic" album={this.state.album}/>
            </div>
        )
    }
}
export default Explore_Page;