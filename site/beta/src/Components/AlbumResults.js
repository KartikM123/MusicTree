import React from 'react';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'

import '../StyleSheets/ComponentSheets/AlbumResults.css';
import '../StyleSheets/general.css';

import DynamicGraph from './Utils/DynamicGraph';

import * as APIUtils from './Utils/ApiCalls';
import * as AlbumTraitUtil from './Utils/AlbumTraitMatch'
const sampleGraph = {
    nodes: [{ id: 'a' }, { id: 'b' }],
    links: [
        { source: 'a', target: 'b' }
    ]
};

const emptyGraph = {
    nodes: [],
    links: [
    ]
};

const NUM_GENRES = 3; // we currently support 3 genres 

class Album_Result extends React.Component {
    constructor(props) {
        super(props)
        this.reseedOnClick = this.reseedOnClick.bind(this);

        //used for recommendation engine
        this.state = {
            ratingMoods: this.getRatingMoods(),
            ...this.props.location.state
        }

        // handle initial render (personality --> album)
        this.getSeed = this.getSeed.bind(this)

        // handle graph state
        this.renderWithSeeds = this.renderBranch.bind(this)
        this.renderChild = this.renderChild.bind(this)

        // fancy magic to add data to/fro graph 
        this.graphDataDict = {}
        this.state.graphData = sampleGraph; // need to populate it with some garbage
        this.setNewGraphState = this.setNewGraphState.bind(this);
        this.addNewGraphNode = this.addNewGraphNode(this);

    }

    addNewGraphNode(newGraphData, albumNode, parent, rerender) {
        // add as a node
        var albumName = String(albumNode["name"]);
        newGraphData.nodes.push({ id: albumName });

        // add to graph data dict for future reference
        this.graphDataDict[albumName]  = albumNode;

        // link if parent
        if (parent != undefined) {
            newGraphData.links.push({ source: parent, target: albumName });
        }

        // rerender (true for initial)
        if (rerender == true) {
            this.setNewGraphState(newGraphData);
        }

        // return to be used in future workflow
        return newGraphData;
    }
    
    setNewGraphState(newGraphData) {
        // this requires a special handler bc the api needs a clear before an update
        this.setState(() => {
            return ({
                graphData: emptyGraph,
                color: 2//"#6134eb"
            })
        });

        this.setState(() => {
            return ({
                graphData: newGraphData,
                color: 6//"#6134eb"
            })
        });
    }

    //seed: the data which is used to inform the search
    //root: the parent of all children
    async renderBranch(seed, root)
    {
        // handle graph update
        // we need to cache it to control updates to graphData
        var newGraphData = this.state.graphData;

        // create a root if this is the first render
        if (root == undefined)
        {
            root = await APIUtils.getRecommendations(seed, this.state.genre);
            console.log("ROOT Album is " + APIUtils.recommendationToString(root));

            newGraphData = this.addNewGraphNode(newGraphData, root, undefined, true); // trigger rerender for first node :D
        }

        // 1 child per genre
        for (var i = 0; i < NUM_GENRES; i++) {
            let child = await APIUtils.getRecommendations(seed, genres[i]);
            newGraphData = this.addNewGraphNode(newGraphData, child, root["name"], false);
        }

        console.log("After click: This is the new graph");
        console.log(newGraphData)

        this.setNewGraphState(newGraphData);

       // this.forceUpdate();

    }

    reseedOnClick = (parentRec, albumRec) =>
    {
        var seed = {
            "seed": albumRec["name"],
            "seed_artists": "",
            "seed_tracks": ""
        }
        
        seed.seed_artists = parentRec["artists"][0]["id"] + "," + albumRec["artists"][0]["id"];
        seed.seed_tracks = parentRec["id"] + "," + albumRec["id"];

        this.renderBranch(seed, albumRec);
    }

    /* Used on mount */
    getRatingMoods() {
        let ratingMoods = [];
        let Ratings = this.props.location.state.Ratings;

        for (var key in Ratings){
            if (Ratings[key] > 3){
                ratingMoods.push(question_map[key]["Positive"]);
            } else {
                ratingMoods.push(question_map[key]["Negative"]);
            }
        }

        return ratingMoods;
    }
    
    getSeed()
    {
        for (var album in album_map)
        {
            var res = AlbumTraitUtil.albumTraitMatch(this.state.ratingMoods, album_map[album]);
            if (res != undefined) //means match was found
            {
                return res;
            }
        }

        console.log("no seeds found!")
        return undefined;
    }

    async componentDidMount(){
        //this seed will be used to search tree
        var seed = this.getSeed();

        await this.renderBranch(seed, undefined);
    }

    render() {
        var seed = this.getSeeds(ratingMoods);

        return (
            <div>
                <div>
                <DynamicGraph 
                    graphData={this.state.graphData} 
                    seed={seed} 
                    rerenderTrigger={this.renderBranch} />
                </div>
            </div>
        )
    }
}
export default Album_Result;
