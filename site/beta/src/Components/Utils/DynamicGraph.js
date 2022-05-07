import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import structuredClone from '@ungap/structured-clone';

class DynamicGraph extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            graphData: this.props.graphData,
        }

        this.ref = React.createRef();
        this.nodeClickHandler = this.nodeClickHandler.bind(this)
        this.printOnUpdate = this.printOnUpdate.bind(this)

    }

    shouldComponentUpdate()
    {
        return true;
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
        var nodesStr = "";
        console.log(graph["nodes"].length)
    }
   
    render() {
        this.printOnUpdate()

        let rawGraphData = structuredClone(this.props.graphData);
        return (
                <ForceGraph2D  
                ref={this.ref}
                nodeRelSize={this.props.colori}
                graphData={rawGraphData}
                onNodeClick={this.nodeClickHandler}/>
        )
    }
}
export default DynamicGraph;