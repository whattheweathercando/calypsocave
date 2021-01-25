// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON


// 1 load JSON files to join from input folder
// -> fetch api 
// 2 merge posts into array of objects,
// -> array.concat
// 3 check for duplicates by id
// 4 sort chronologically
// 5 make object GraphImages {}
// let posts_obj = {"GraphImages": posts }
// 6 stringify object
// -> let text = JSON.stringify(posts_obj)
// 7 write object GraphImages {} to main file
// -> fs module, fs.writeFile


// const fs = require('fs');

const inputFolder = "/input/";

const filesToJoin = [

    // // #calypsocave ** DEF
    // "calypsocave_191004",
    // "calypsocave_191019",
    // "calypsocave_200321",
    // "calypsocave_201003",
    // "calypsocave_210105"
    
    // // #calypsoscave ** DEF
    // "calypsoscave_191004",
    // "calypsoscave_191019",
    // "calypsoscave_200321",
    // "calypsoscave_201006",
    // "calypsoscave_210105"

    // // #calipsocave ** DEF
    // "calipsocave_191004",
    // "calipsocave_201008",
    // "calipsocave_210102"

    // // #calipsoscave ** DEF
    // "calipsoscave_191004",
    // "calipsoscave_210102"

    // // #calypsocavegozo ** DEF
    // "calypsocavegozo_191023",
    // "calypsocavegozo_210102"

    // // #calypsocaveview ** DEF
    // "calypsocaveview_191023",
    // "calypsocaveview_210102"

    // // #grottadicalipso ** DEF
    // "grottadicalipso_200321",
    // "grottadicalipso_210102"


    // // 1072361276130118  (location id: Calypso’s Cave) ** DEF
    // "1072361276130118_191003",
    // "1072361276130118_191023",
    // "1072361276130118_200321",
    // "1072361276130118_201006",
    // "1072361276130118_210106"

    // // 1016120985  (location id: Calypso’s Cave) ** DEF
    // "1016120985_191004",
    // "1016120985_191022",
    // "1016120985_200411",
    // "1016120985_201006",
    // "1016120985_210106"

    // // 582935286 (location id: Calipso Caves) ** DEF
    // "582935286_210102"

    // // 579372599222643 (location id: Calypso Cave) ** DEF
    // "579372599222643_210102"

    // // 425116534182062 (location id: Calypso Cave) ** DEF
    // "425116534182062_210102"


    // // #talmixtacave ** DEF
    // "talmixtacave_191231",
    // "talmixtacave_200413",
    // "talmixtacave_201008",
    // "talmixtacave_210107"

    // // #mixtacave ** DEF
    // "mixtacave_191231",
    // "mixtacave_200413",
    // "mixtacave_210107"

    // // 829241613902578 (location id: Tal Mixta Cave) ** DEF
    // "829241613902578_200102",
    // "829241613902578_200328",
    // "829241613902578_210107"

    // // 445817611 (location id: L-Ghar Tal-Mixta) ** DEF 
    // "445817611_200413",
    // "445817611_210108"


    // // individual main files - (remove folder /input/ from requestUrl base)
    // // cc-main
    "582935286-main-210106",
    "1016120985-main-210106",
    "425116534182062-main-210106",
    "579372599222643-main-210106",
    "1072361276130118-main-210106",
    "calipsocave-main-210106",
    "calipsoscave-main-210106",
    "calypsocave-main-210105",
    "calypsocavegozo-main-210106",
    "calypsocaveview-main-210106",
    "calypsoscave-main-210105",
    "grottadicalipso-main-210106"
    // // cc-main++ (including tal-mixta)
    // "talmixtacave-main-210107",
    // "mixtacave-main-210107",
    // "829241613902578-main-210107",
    // "445817611-main-210108"
];

let postsJoined = [];
let postsSorted;
let postsNoDuplicates;
let postsObj = {}

const processButton = document.querySelector("#button-process")
const writeButton = document.querySelector("#button-write")
const downloadLink = document.querySelector('#download-link')



const fetchPosts = async(filename) => {
    try {
        let requestUrl = `/data/${ filename }.json`;
        let response = await fetch(requestUrl);
        let data = await response.json();
        let posts = data.GraphImages;
        // console.log(posts); // fetched posts
        // console.log(posts[0].edge_media_to_caption.edges[0].node.text); // test access fetched posts
        return posts;
    } catch(err){
        console.log(err);
    }
}

const joinPosts = async _ => {
    console.log('Start async for loop')
    // fetch json files and join posts
    for (let index = 0; index < filesToJoin.length; index++) {
      const filename = filesToJoin[index]
      const posts = await fetchPosts(filename)
      console.log(posts)
      postsJoined = postsJoined.concat(posts);
    }
    console.log('End async for loop')
    // console.log(postsJoined)

    // sort posts chronologically
    postsSorted = sortByKeyAsc(postsJoined, "taken_at_timestamp")
    // console.log(postsJoinedSorted)
    
    // test with duplicates
    // postsNoDuplicates = postsSorted;
    
    // remove duplicates
    postsNoDuplicates = removeDuplicatesFromArrayByProperty(postsSorted, 'id')
    // console.log(postsNoDuplicates);

    postsObj = { "GraphImages": postsNoDuplicates }; 
    console.log(postsObj);
  }



// sort chronologically, ascending order
function sortByKeyAsc(array, key) {
	return array.sort((a, b) => a[key] - b[key]);
}
// sort chronologically, descending order
function sortByKeyDesc(array, key) {
    return array.sort((a, b) => b[key] - a[key]);
}

// remove duplicates
// https://dev.to/pixari/what-is-the-best-solution-for-removing-duplicate-objects-from-an-array-4fe1
// reduce method
const removeDuplicatesFromArrayByProperty = (arr, prop) => arr.reduce((accumulator, currentValue) => {
    if(!accumulator.find(obj => obj[prop] === currentValue[prop])){
      accumulator.push(currentValue);
    }
    return accumulator;
}, [])
// -> do with Set method

// export new json file

function writeFile(){
  let jsonString = JSON.stringify(postsObj);
  // let jsonString = JSON.stringify(postsObj, null, 4);
	var file = new Blob([jsonString], {type: 'application/json'});
	let fileName = 'cc-main-210108.json';
  var url = window.URL.createObjectURL(file);
	downloadLink.download = fileName;
  downloadLink.href = url;
  downloadLink.innerText = `Download ${fileName}`
}



// Eventlisteners

processButton.addEventListener("click", function() {
  joinPosts();
});
writeButton.addEventListener("click", writeFile)
