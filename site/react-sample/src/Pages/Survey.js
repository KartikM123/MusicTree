import React from 'react';
import ReactDOM from 'react-dom';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import Survey from '../Components/Survey_Base';

//https://itnext.io/building-multi-page-application-with-react-f5a338489694

ReactDOM.render(<Survey/>, document.getElementById("survey"))