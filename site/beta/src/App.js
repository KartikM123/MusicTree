import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './Components/Home'
import Survey_Result from './Components/SurveyResults'
import Album_Result from './Components/AlbumResults'
import Survey from './Components/Survey_Base'
import Genre_Page from './Components/Genres'

class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={HomePage} exact/>
             <Route path="/surveyResult" component={Survey_Result}/>
             <Route path="/album" component={Album_Result}/>
             <Route path="/genres" component={Genre_Page}/>
             <Route path="/survey" component={Survey}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;