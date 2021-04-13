
// HTML elements
const recordsIndex = document.querySelector('#records-index')
const singleRecordContainer = document.querySelector('#single-record')

// Airtable variables
const token = 'keyQEt7ap2NN2NF2h'
const baseUrl = 'https://api.airtable.com/v0/appLR6Kx7gDtp6taX/CC-main'


const fetchRecords = async () => {
    try {
        const queryParams = 'maxRecords=64&view=all'
        const url = `${baseUrl}?${queryParams}`

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
        let url = `${baseUrl}/${id}`
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
    console.log(caption)
    let output = `
        <div>
        <div>Record ${record.id}</div>
        <div>${caption}</div>
    `
    singleRecordContainer.innerHTML = output
}