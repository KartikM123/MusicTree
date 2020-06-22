import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import Mood_Result from '../Components/MoodResults';

console.log("Rendered!");
ReactDOM.render(<Mood_Result/>, document.getElementById("Moods"))
