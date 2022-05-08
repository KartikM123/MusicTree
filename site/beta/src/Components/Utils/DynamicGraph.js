import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import structuredClone from '@ungap/structured-clone';
import * as THREE from "three";
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

        return (
                <ForceGraph2D  
                graphData={rawGraphData}
                onNodeClick={this.nodeClickHandler}
                nodeCanvasObject={
                (node, ctx) => {
                    //ctx is of type CanvasRenderingContext2D
                    ctx.fillText(node.id,node.x,node.y);
                } }
                  />
        )
    }
}
export default DynamicGraph;