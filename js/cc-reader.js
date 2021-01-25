
const dataFiles = [
    "cc-main-210108",
    "cc-tm-main-210108",
    "tm-main-210108",
    // "calypsoscave-main-210105",
    // "calypsocave-main-210105",
    // "calipsocave-main-210106",
    // "calipsoscave-main-210106",
    // "calypsocavegozo-main-210106",
    // "calypsocaveview-main-210106",
    // "grottadicalipso-main-210106",
    // "582935286-main-210106",
    // "579372599222643-main-210106",
    // "425116534182062-main-210106",
    // "1072361276130118-main-210106",
    // "1016120985-main-210106",
    // "talmixtacave-main-210107",
    // "mixtacave-main-210107",
    // "829241613902578-main-210107",
    // "445817611-main-210108"
];
let selectedFile = dataFiles[0];

let posts = [];
let i = 0;
let j = 0;

const fetchData = async(filename) => {
    try {
        let requestUrl = `/data-main/${ filename }.json`;
        let response = await fetch(requestUrl);
        return await response.json();
    } catch(err){
        console.log(err);
    }
}
const initData = async(filename) => {
    try {
        let data = await fetchData(filename);
        posts = data.GraphImages;
        posts = sortByKeyAsc(posts, "taken_at_timestamp");
        console.log(posts); // fetched posts
        posts = posts.map( (v, index) => ({...v, queryIndex: index }))
        console.log("Posts indexed: ", posts);
        // console.log(posts[0].edge_media_to_caption.edges[0].node.text); // test access fetched posts
        populateReader(i, posts);
    } catch(err) {
        console.log(err);
    }
}
initData(selectedFile);


const idContainer = document.querySelector(".id");
const locationIdContainer = document.querySelector(".location-id")
const locationNameContainer = document.querySelector(".location-name")
const dateContainer = document.querySelector(".datetime");
const timestampContainer = document.querySelector(".timestamp")

const captionContainer = document.querySelector(".caption");
const imagesContainer = document.querySelector("#images-container");

function populateReader(i, d) {
    
    let id = d[i].id;
    idContainer.innerHTML = `id: ${id}`

    
    if (d[i].location ){
        let locationId = d[i].location.id
        let locationName = d[i].location.name
        locationIdContainer.innerHTML = `location id: ${locationId}`
        locationNameContainer.innerHTML = `location name: ${locationName}`
    } else {
        locationIdContainer.innerHTML = "[no location id]";
        locationNameContainer.innerHTML = "[no location name]";
    }

    // check if not null/undefined
    if (d[i].edge_media_to_caption.edges[0]){
        let caption = d[i].edge_media_to_caption.edges[0].node.text;
        captionContainer.innerHTML = caption;
    } else {
        captionContainer.innerHTML = "[no caption]";
    }
    

    let timestamp = d[i].taken_at_timestamp;
    timestampContainer.innerHTML = `timestamp: ${timestamp}`
    let datetime = timeConverter(timestamp);
    dateContainer.innerHTML = datetime;
    
    // let imgUrl = d[i].display_url;
    // imgUrlContainer.href = imgUrl; // instagram source link
    
    // let imgFilename = d[i].display_url.match(/[^\/?#]+(?=$|[?#])/);
    // imgFilenameContainer.textContent = imgFilename;

    // const localBase = "file:///Users/stefankarrer1/Documents/WORKS/Calypso Cave/CRAWL/instagram-scraper_DOWNLOADS/";
    const localBase = "./assets/images/"
    
    //let localPath = `${localBase}${imgFilename}`;
    
    // imgContainer.src = imgUrl;
    // imgContainer.src = localPath;
    

    // ALL images (urls)
    let imagesUrl = d[i].urls;
    console.log(imagesUrl);
    
    // All images map/extract filenames
    const imagesFilename = imagesUrl.map(x => x.match(/[^\/?#]+(?=$|[?#])/));
    console.log(imagesFilename);
    
    imagesContainer.innerHTML = "";

    imagesFilename.forEach(element => {
        let imgEl = document.createElement("img")
        imgEl.classList.add("image");
        let localPath = `${localBase}${element}`;
        imgEl.src = localPath
        imagesContainer.appendChild(imgEl)
        
        let filenameEl = document.createElement("div")
        filenameEl.classList.add("img-filename")
        filenameEl.innerHTML = element
        imagesContainer.appendChild(filenameEl)

    });

}

// Populate Next / previous function
function next() {
    if ( i < posts.length ) {
        i++;
        populateReader(i, posts);
    } else {
        i = 0;
        populateReader(i, posts);
    }
}
function previous() {
    if ( i == 0 ) {
        i = posts.length-1;
        populateReader(i, posts);
    } else {
        i--;
        populateReader(i, posts);
    }
}
// Keydown 
document.addEventListener("keydown", event => {
    if (event.code === 'ArrowRight') {
      next();
    };
    if (event.code === 'ArrowLeft') {
        previous();
    };
    if (event.code === "Enter"){
        goToId();
    }
});

const select = document.querySelector("#data-files-select");
dataFiles.forEach(filename => {
    let el = document.createElement("option");
    el.value = filename;
    el.innerHTML = filename;
    select.append(el);
});

select.onchange = handleChange;

function handleChange(e) {
  selectedFile = e.target.value;
  console.log(selectedFile);
  initData(selectedFile);
  i = 0;
  populateReader(i, posts);
}



// sort chronologically, ascending order
function sortByKeyAsc(array, key) {
	return array.sort((a, b) => a[key] - b[key]);
}
// sort chronologically, descending order
function sortByKeyDesc(array, key) {
    return array.sort((a, b) => b[key] - a[key]);
}



// function convert unix timestamp to date / time
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
    // var month = months[a.getMonth()];
    // month as 2 digits (MM)
    var month = ("0" + (a.getMonth() + 1)).slice(-2);
	// date as 2 digits (DD)
    var date = ("0" + a.getDate()).slice(-2);

    // hours as 2 digits (hh)
    var hour = ("0" + a.getHours()).slice(-2);

    // minutes as 2 digits (mm)
    var min = ("0" + a.getMinutes()).slice(-2);

    // seconds as 2 digits (ss)
    var sec = ("0" + a.getSeconds()).slice(-2);

    // date & time as YYYY-MM-DD hh:mm:ss format:
    // var time = year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    // ISO 8601 "2011-12-19T15:28:46.493Z"
    var time = a.toISOString();
    return time;
}



// to do 
// function go to ID
// add fixed index (query-index) to sorted data array
// map()
// get query-index where ID == query-id
// populate reader (i = query-index )
function goToId() {
    let input, id, qIndex;
    input = document.getElementById("go-to-id");
    id = input.value;
    console.log(id);
    for (let i=0; i < posts.length; i++) {
        if (posts[i].id === id) {
            qIndex = posts[i].queryIndex;
        }
    }
    console.log(qIndex);
    i = qIndex;
    populateReader(i, posts);
}

// To do 
// Search filter
// if (caption.toUpperCase().indexOf(queryString) > -1) { ..
