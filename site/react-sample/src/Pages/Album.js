import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import Album_Result from '../Components/AlbumResults';

console.log("Rendered!");
ReactDOM.render(<Album_Result/>, document.getElementById("Album"))
