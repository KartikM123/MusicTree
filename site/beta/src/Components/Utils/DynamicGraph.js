import React from 'react';
import ForceGraph3D from 'react-force-graph-2d';
import structuredClone from '@ungap/structured-clone';
import * as THREE from 'three'
import * as APICallUtils from './ApiCalls';
class DynamicGraph extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            graphData: this.props.graphData,
        }

        this.nodeClickHandler = this.nodeClickHandler.bind(this)
        this.printOnUpdate = this.printOnUpdate.bind(this)

    }

    nodeClickHandler (node)
    {
        console.log("Entered on click listeners!")
        this.props.rerenderTrigger(node.id)
    }

    // just organize helpers here
    printOnUpdate() {

        console.log("new render")
        var graph = this.props.graphData;
        console.log(graph["nodes"].length)
    }
   
    render() {
        this.printOnUpdate()

        //pass by reference so forcegraph doesn't update unless we want it to
        let rawGraphData = structuredClone(this.props.graphData);
        let rawGraphDataDict = structuredClone(this.props.graphDataDict);
        console.log("wer")

        return (
                <ForceGraph3D  
                graphData={rawGraphData}
                onNodeClick={this.nodeClickHandler}
                nodeThreeObject={({ img }) => {
                    console.log(img);
                    console.log("hi?")
                    let imgUrl = APICallUtils.getAlbumImg(rawGraphDataDict[img])
                    console.log(imgUrl);
                    const imgTexture = new THREE.TextureLoader().load(`${imgUrl}`);
                    const material = new THREE.SpriteMaterial({ map: imgTexture });
                    const sprite = new THREE.Sprite(material);
                    sprite.scale.set(12, 12);
          
                    return sprite;
                  }}
                  />
        )
    }
}
export default DynamicGraph;