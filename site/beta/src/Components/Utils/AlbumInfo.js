import React from 'react';

class AlbumInfo extends React.Component
{
    render() {

        return (
            <div>
                {this.props.album["album"]["name"]}
                <img src={this.props.album["imgUrl"]} className='albumImg'></img>
            </div>
        )
    }
}
export default AlbumInfo;