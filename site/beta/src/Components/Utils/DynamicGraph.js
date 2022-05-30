import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import structuredClone from '@ungap/structured-clone';

import mood_map from '../../Question_Data/MoodMapping.json'
import * as APIUtils from './ApiCalls';
import * as AlbumTraitUtil from './AlbumTraitMatch'

import '../../StyleSheets/ComponentSheets/AlbumSnippet.css';

const emptyGraph = {
    nodes: [],
    links: [
    ]
};

const NUM_GENRES = 3; // we currently support 3 genres 

const emptyAlbum = { "album": {
    "name": ""
}, "imgUrl": ""};

class DynamicGraph extends React.Component
{
    constructor(props)
    {
        super(props)

        let cachedState = localStorage.getItem("graphState");
        if (cachedState != undefined)
        {
            console.log("loading cached state");
            this.state = JSON.parse(cachedState);
            console.log(this.state)
        } else {
            console.log("fresh load")
            // store cached state
            this.state = {
                graphData: emptyGraph,
                graphDataRef: {},
                ratingMoods: this.props.ratings.split(","),
            }
        }

        // onClick handlers
        this.printInfo = emptyAlbum;
        this.exportHandler = this.exportHandler.bind(this);

        this.nodeClickHandler = this.nodeClickHandler.bind(this)
        this.printOnUpdate = this.printOnUpdate.bind(this)
        this.renderedImages = {}

        // handle initial render (personality --> album)
        this.getSeed = this.getSeed.bind(this)

        // handle graph state
        this.renderBranch = this.renderBranch.bind(this)

        // fancy magic to add data to/fro graph 
        this.graphDataDict = this.state.graphDataRef;
        this.setNewGraphState = this.setNewGraphState.bind(this);
        this.addNewGraphNode = this.addNewGraphNode.bind(this);

        // save state for callbacks
        // TODO
    }

    async addNewGraphNode(newGraphData, albumNode, parent, rerender) {
        // add as a node
        var albumName = String(albumNode["name"]);
        newGraphData.nodes.push({ id: albumName });

        // add to graph data dict for future reference
        this.graphDataDict[albumName]  =  albumNode;
        this.graphDataDict[albumName]["imgUrl"] = await APIUtils.getAlbumImg(albumNode);

        // link if parent
        if (parent != undefined) {
            newGraphData.links.push({ source: parent, target: albumName });
        }

        // rerender (true for initial)
        if (rerender == true) {
            await this.setNewGraphState(newGraphData);
        }

        // return to be used in future workflow
        return newGraphData;
    }
    
    async setNewGraphState(newGraphData) {
        // this requires a special handler bc the api needs a clear before an update
        await this.setState(() => {
            return ({
                graphData: newGraphData,
                graphDataRef: this.graphDataDict,
                color: 6//"#6134eb"
            });
        });

        localStorage.setItem("graphState", JSON.stringify(this.state));
    }

    //seed: the data which is used to inform the search
    //root: the parent of all children
    async renderBranch(root)
    {
        if (this.state.seed === undefined) {
            console.error("No seed defined!")
        }

        // handle graph update
        // we need to cache it to control updates to graphData
        var newGraphData = structuredClone(this.state.graphData);

        // create a root if this is the first render
        if (root == undefined)
        {
            //on root we need to disregard the placeholder TODO: make this nicer
            newGraphData = emptyGraph;

            var rootInfo = await APIUtils.getRecommendations(this.state.seed, this.props.genre[0]);

            newGraphData = await this.addNewGraphNode(newGraphData, rootInfo, undefined, true); // trigger rerender for first node :D
            
            root = rootInfo["name"];
        }

        // format seed artist
        let newSeed = structuredClone(this.state.seed);
        let seedArtistId = this.state.graphDataRef[root]["artists"][0]["id"];
        newSeed.push("seed_artists=" + seedArtistId);
        let seedTrackId = this.state.graphDataRef[root]["id"];
        newSeed.push("seed_tracks=" + seedTrackId);
        // 1 child per genre
        for (var i = 0; i < NUM_GENRES; i++) {
            let child = await APIUtils.getRecommendations(newSeed, this.props.genre[i]);
            newGraphData = await this.addNewGraphNode(newGraphData, child, root, false);
        }

        this.setNewGraphState(newGraphData);

       // this.forceUpdate();

    }
    
    getSeed()
    {
        var ratingMoodsSplit = (this.state.ratingMoods)
        var seed = [];
        seed.push(mood_map["Mind"][ratingMoodsSplit[0]] + "=" + mood_map["Mind"]["value"])
        seed.push(mood_map["Energy"][ratingMoodsSplit[1]] + "=" + mood_map["Energy"]["value"])
        seed.push(mood_map["Romance"][ratingMoodsSplit[2]] + "=" + mood_map["Romance"]["value"])
        seed.push(mood_map["Knowledge"][ratingMoodsSplit[3]] + "=" + mood_map["Knowledge"]["value"])

        return seed;
    }

    async componentDidMount(){
        // on reload this should be cached 
        if (this.state.seed === undefined)
        {
            //this seed will be used to search tree
            await this.setState(() => {
                return ({
                    seed: this.getSeed()
                })
            });

            await this.renderBranch(undefined);
        }
    }

    nodeClickHandler (node)
    {
        if (this.props.clickHandler == 'print') {
            this.printInfo = this.state.graphDataRef[node.id]
            document.getElementById('snippetInfo').innerHTML = `<img src=${this.printInfo["imgUrl"]} className='albumImg'></img> <a className=\"resetThis\" href=\"https://open.spotify.com/album/${this.printInfo["album"]["id"]}\">${this.printInfo["album"]["name"]}</a>`
        } else {
            document.getElementById('snippetInfo').innerHTML = ""

            this.renderBranch(node.id)
        }
    }

    befo

    exportHandler() {
        
        let songURIList = []; // create playlist by id of each
        Object.keys(this.state.graphDataRef).forEach((id) => {
            const nodeInfo = this.state.graphDataRef[id];
            songURIList.push(nodeInfo["uri"])
        })

        APIUtils.createPlaylist(songURIList, this.props.accessToken).then((res) => {
            document.getElementById('snippetInfo').innerHTML = res;
        })
    }

    // just organize helpers here
    printOnUpdate() {

        console.log("new render")
    }

    // componentDidMount() {
    //     console.log(' State : ')
    //     console.log(this.state)
    //     console.log(' Props : ')
    //     console.log(this.props)
    // }
   
    render() {
        //this.printOnUpdate()

        //pass by reference so forcegraph doesn't update unless we want it to
        let rawGraphData = structuredClone(this.state.graphData);
        let rawGraphDataDict = structuredClone(this.state.graphDataRef);
        let exportHandler = undefined;
        if (this.props.accessToken != undefined)
        {
            exportHandler = <button onClick={this.exportHandler}>export</button>;
            
            // make sure we are no longer caching graphState
            localStorage.removeItem("graphState");
        }

        return (
            <div>
                {exportHandler}
                <div id="snippetInfo" className='albumSnippet'>
                </div>
                <ForceGraph2D  
                graphData={rawGraphData}
                onNodeClick={this.nodeClickHandler}
                nodeCanvasObject={
                async (node, ctx) => {
                    //ctx is of type CanvasRenderingContext2D
                    if (rawGraphDataDict[node.id] == undefined) {
                        //draw text for default case
                        ctx.fillText(node.id,node.x,node.y);
                    } else {
                        if (this.renderedImages[node.id] == undefined) {
                            var strDataURI = rawGraphDataDict[node.id]["imgUrl"]
                            
                            var img = new Image();
                            img.onload = () => {
                                ctx.drawImage(img, node.x - 8, node.y - 5, 20, 20);
                            };
                            img.src = strDataURI;
                            this.renderedImages[node.id] = img;
                        } else {
                            try {
                            var img = this.renderedImages[node.id];
                            ctx.drawImage(img, node.x - 8, node.y - 5, 20, 20);
                            } catch(e) {
                                console.error(e)
                            }
                        }

                    }

                    // ctx.fillText(node.id,node.x,node.y);
                } }
                  />
            </div>
        )
    }
}
export default DynamicGraph;