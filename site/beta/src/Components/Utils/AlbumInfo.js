import React from 'react';

import '../../StyleSheets/general.css';
class AlbumInfo extends React.Component
{
    render() {
        let albumInfo = this.props.album;
        return (
            <div className='albumSnippet'>
                {albumInfo["album"]["name"]}
                <img src={albumInfo["imgUrl"]}></img>
            </div>
        )
    }
}
export default AlbumInfo;