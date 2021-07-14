
// HTML elements
const recordsIndex = document.querySelector('#records-index')
const singleRecordContainer = document.querySelector('#single-record')

// Airtable variables
const token = 'keyQEt7ap2NN2NF2h'
const baseUrl = 'https://api.airtable.com/v0/appLR6Kx7gDtp6taX'
const table = 'CC-main'
const views = ['all', 'book']
const maxRecords = 128

const fetchRecords = async () => {
    try {
        const queryParams = `maxRecords=${maxRecords}&view=${views[1]}`
        const url = `${baseUrl}/${table}?${queryParams}`

        const res =  await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log(data)
        parseRecords(data)
        initSingleRecordButtons()
    } catch(err){
        console.error(err)
    }
}

fetchRecords()


const parseRecords = (data) => {
    let output = `<h2>CC Airtable Records Index</h2>`
    data.records.forEach( (record, index) => {
        output += `
            <div>
                <div>${index}</div>
                <div><button type="button" class="fetch-single-record" data-record-id="${record.id}">${record.id}</button></div>
                <div>${record.fields.timestamp}</div>
                <div>${record.fields.location_id}</div>
            </div>
            <br>
        `
    });
    recordsIndex.innerHTML = output
}


const initSingleRecordButtons = () => {
    let recordLinks = document.querySelectorAll('.fetch-single-record')
    recordLinks.forEach(element => {
        element.addEventListener('click', (event) => {
            let id = event.target.dataset.recordId
            fetchSingleRecord(id)
        })
    })  
}


const fetchSingleRecord = async (id) => {
    try {
        console.log(`Fetching record ${id}`)
        let url = `${baseUrl}/${table}/${id}`
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`}
        })
        const data = await response.json()
        // console.log(data)
        parseSingleRecord(data)
    } catch(err){
        console.error(err)
    }
}

const parseSingleRecord = (record) => {
    let caption = record.fields.caption
    let image = record.fields.image[0].url
    let thumb = record.fields.image[0].thumbnails.large
    let thumbUrl = thumb.url
    console.log(caption)
    let output = `
        <div>
        <div>${caption}</div>
        <div><img src="${thumbUrl}" width="${thumb.width}" height="${thumb.height}"></div>
    `
    singleRecordContainer.innerHTML = output
}