import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import HomePage from '../Components/Home';

console.log("Rendered!");
ReactDOM.render(<HomePage/>, document.getElementById("HomePage"))
