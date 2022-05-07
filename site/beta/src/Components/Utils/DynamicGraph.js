import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
class DynamicGraph extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            graphData: this.props.graphData,
            color: this.props.colori
        }

        this.ref = React.createRef();
        this.nodeClickHandler = this.nodeClickHandler.bind(this)

    }

    shouldComponentUpdate()
    {
        console.log("trigger update")
        return true;
    }

    nodeClickHandler (node)
    {
        console.log("Entered on click listeners!")
        this.props.rerenderTrigger(this.props.ratingMoods, this.props.seed, node.id)
    }
   
    render()
    {
        return (
                <ForceGraph2D  
                ref={this.ref}
                nodeRelSize={this.props.colori}
                graphData={this.props.graphData}
                onNodeClick={this.nodeClickHandler}/>
        )
    }
}
export default DynamicGraph;