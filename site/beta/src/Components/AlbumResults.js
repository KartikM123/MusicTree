import React from 'react';
import question_map from '../Question_Data/questions.json'
import album_map from '../Question_Data/AlbumMapping.json'
import structuredClone from '@ungap/structured-clone';

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
        this.getRatingMoods = this.getRatingMoods.bind(this)
        //used for recommendation engine
        this.state = {
            ratingMoods: this.getRatingMoods(),
            seed: undefined,
            graphDataRef: {},
            ...this.props.location.state
        }

        // handle initial render (personality --> album)
        this.getSeed = this.getSeed.bind(this)

        // handle graph state
        this.renderBranch = this.renderBranch.bind(this)

        // fancy magic to add data to/fro graph 
        this.graphDataDict = {}
        this.state.graphData = sampleGraph; // need to populate it with some garbage
        this.setNewGraphState = this.setNewGraphState.bind(this);
        this.addNewGraphNode = this.addNewGraphNode.bind(this);

    }

    async addNewGraphNode(newGraphData, albumNode, parent, rerender) {
        // add as a node
        var albumName = String(albumNode["name"]);
        newGraphData.nodes.push({ id: albumName });

        // add to graph data dict for future reference
        this.graphDataDict[albumName]  = albumNode;

        // link if parent
        if (parent != undefined) {
            console.log(`creating root ${parent} to ${albumName}`)
            newGraphData.links.push({ source: parent, target: albumName });
        }

        // rerender (true for initial)
        if (rerender == true) {
            console.log("rerender!")
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
            })
        });
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

            var rootInfo = await APIUtils.getRecommendations(this.state.seed, this.state.genre);
            console.log("ROOT Album is " + APIUtils.recommendationToString(rootInfo));
            console.log(rootInfo)

            newGraphData = await this.addNewGraphNode(newGraphData, rootInfo, undefined, true); // trigger rerender for first node :D
            
            root = rootInfo["name"];
        }

        // 1 child per genre
        for (var i = 0; i < NUM_GENRES; i++) {
            let child = await APIUtils.getRecommendations(this.state.seed, this.state.genre[i]);
            newGraphData = await this.addNewGraphNode(newGraphData, child, root, false);
        }

        console.log("allow renders again!")

        this.setNewGraphState(newGraphData);

       // this.forceUpdate();

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
            var res = AlbumTraitUtil.albumTraitMatch(this.state.ratingMoods, album);
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
        await this.setState(() => {
            return ({
                seed: this.getSeed()
            })
        });

        await this.renderBranch(undefined);
    }

    render() {
        return (
            <div>
                <div>
                <DynamicGraph 
                    graphData={this.state.graphData} 
                    graphDataDict={this.state.graphDataDict}
                    rerenderTrigger={this.renderBranch} />
                </div>
            </div>
        )
    }
}
export default Album_Result;
