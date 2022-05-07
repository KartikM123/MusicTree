import React, {useState, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
const DynamoGraph = (props) => {
    const [data, setData] = useState({ nodes: [{ id: 'a' }], links: [] });
    let nodesGlobal = [{ id:1 }];
    let size = 0; 
    let linksGlobal = [{ source: 1, target: 'a'}]
    // useEffect(() => {
    //       // Add a new connected node every second
    //     setInterval(() => {
    //         console.log(nodesGlobal);
    //         console.log(size)
    //         if (size < nodesGlobal.length)
    //         {
    //             size = nodesGlobal.length;        
    //             // Add a new connected node every second
    //             setData(({ nodes, links }) => {
    //             return {
    //                 nodes: [...nodes, ...nodesGlobal],
    //                 links: [...links]
    //             };
    //             });
    //         }
    //       }, 1000);
    //   }, [nodesGlobal, size]);
    const handleClick = useCallback(node => {              
      const { nodes, links } = data;
    
      const newNodes = props.getNewNodes(node);
      const node1 = newNodes[0];
      const node2 = newNodes[1];
      const node3 = newNodes[2];
      // Remove node on click    
    //   setData(({ nodes, links }) => {
    //     return {
    //         nodes: [...nodes, { node1 }, { node2 }, { node3 }],
    //         links: [...links]
    //     };
    // });
    // console.log("HERE!")
    // setData(({ nodes, links }) => {
    //     return {
    //         nodes: [...nodes],
    //         links: [...links, { source: {node1}, target: 'a' }]
    //     };
    // });
    nodesGlobal.push({id: node1});

    console.log(nodesGlobal)
    }, [data, setData, nodesGlobal]);

    return <ForceGraph2D
      enableNodeDrag={false}
      onNodeClick={handleClick}
      graphData={data}
    />;
  };
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
        // console.log(this.ref.current)
        // this.ref.current.refresh();
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