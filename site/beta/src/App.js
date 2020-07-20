import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './Components/Home'
import Mood_Result from './Components/MoodResults'
import Album_Result from './Components/AlbumResults'
import Survey from './Components/Survey_Base'
import Explore_Page from './Components/Search_Explore_Page'

class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={HomePage} exact/>
             <Route path="/moods" component={Mood_Result}/>
             <Route path="/album" component={Album_Result}/>
             <Route path="/survey" component={Survey}/>
             <Route path="/explore" component={Explore_Page}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;