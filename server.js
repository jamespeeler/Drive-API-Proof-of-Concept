//------------------------------------------------------------------
//Getting consts and requires etc. set up
//------------------------------------------------------------------

require('dotenv').config() //use dotenv for SECRETS
const express = require('express') //use express
const app = express() //set express const

// const MongoClient = require('mongodb').MongoClient //old code, keeping it around Just In Case™
const { MongoClient } = require('mongodb') //set up to use mongodb
const uri = process.env.DB_STRING //grab uri from .env
let dbName = 'branch-connector-database' //set database name
let db //initialize 'db' variable

const PORT = 2121 //set port, will need to change this later

const url = require('url') //need url access
const DoorDashClient = require('@doordash/sdk') //use the DoorDash Drive API
const { log } = require('console') //Drive API needs console access
const jwt = require('jsonwebtoken') //use jwt for API auth

//make an externalDeliveryID variable because i was getting tired of manually changing it every time i needed to test something
let externalDeliveryID = 'D-22365'

//------------------------------------------------------------------
//MongoDB connection
//------------------------------------------------------------------

const client = new MongoClient(uri)

//Connect to Database
MongoClient.connect(uri)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// async function run() {
//     try {
//         let database = client.db('branch-connector-database');
//         let menuItems = database.collection('menu-items');
        
//         console.log(menuItems.find())

//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }

// run().catch(console.dir)

// //Set up MongoDB variables
// let dbConnectionStr = process.env.DB_STRING,
//     dbName = 'branch-connector-database',
//     db




//------------------------------------------------------------------
//DoorDash Drive API setup
//------------------------------------------------------------------

//this contains the key details to make API calls to DoorDash
const accessKey = {
    "developer_id": process.env.DEVELOPER_ID,
    "key_id": process.env.KEY_ID,
    "signing_secret": process.env.SIGNING_SECRET
}

//make a data object for getting a JWT
const data = { 
    aud: 'doordash',
    iss: accessKey.developer_id,
    kid: accessKey.key_id,
    exp: Math.floor(Date.now() / 1000 + 300),
    iat: Math.floor(Date.now() / 1000)
}

//headers for DoorDash JWT
const headers = {algorithm: 'HS256', header: {'dd-ver': 'DD-JWT-V1'}}

//JWT token creation
const token = jwt.sign(
    data,
    Buffer.from(accessKey.signing_secret, 'base64'),
    headers,
)

//confirm token was created
if (token) {
    console.log('JWT Generated');
}

//------------------------------------------------------------------
//Set up for the server API
//------------------------------------------------------------------

app.set('view engine', 'ejs') //use ejs for HTML templates
app.use(express.static('public')) //use a public folder to send static files
app.use(express.urlencoded({ extended: true })) //middleware to do something?
app.use(express.json()) //render some stuff as json

//------------------------------------------------------------------
//Listen for request calls
//------------------------------------------------------------------

// listen for root GET requests and send HTML when requested 
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/', async(req, res) => {
    
})

//listen for POST requests from the /create-delivery-quote endpoint
app.post('/create-delivery-quote', async (req,res) => {

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    //send formatted addresses and phone numbers to Drive API to receive a quote
    const response = await client.deliveryQuote({
        external_delivery_id: externalDeliveryID,
        pickup_address: '1000 4th Ave, Seattle, WA, 98104',
        pickup_phone_number: '+16505555555',
        pickup_business_name: 'example store',
        dropoff_address: '1201 3rd Ave, Seattle, WA, 98101',
        dropoff_phone_number: '+16505554555'
    })
    .then(response => { //log the data + respond
        console.log(response.data)
        res.send(response)
    })
    .catch(err => { //catch errors
        console.log(err)
    })

})

//listen for POST requests on the /accept-quote endpoint
app.post('/accept-quote', async (req, res) => {

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    // send delivery-id to Drive API to accept the quote
    const response = await client.deliveryQuoteAccept(
        externalDeliveryID
    )
    .then(response => { // log the data + respond
        console.log(response.data)
        res.send(response)
    })
    .catch(err => { //catch errors
        console.log(err)
    })

})

//listen for POST requests on the /create-delivery endpoint
app.post('/create-delivery', async (req, res) => {

    //make an 'itemsObj' variable which pulls item data from the request body
    let itemsObj = req.body.finalPayload

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    //send a createDelivery object to DoorDash to create a delivery
    const response = client.createDelivery({
        "items": itemsObj,
        external_delivery_id: externalDeliveryID,
        pickup_address: '1000 4th Ave, Seattle, WA, 98104',
        pickup_phone_number: '+16505555555',
        dropoff_address: '1201 3rd Ave, Seattle, WA, 98101',
        dropoff_phone_number: '+16505555555'
    })
    .then(res => { //log the data
        console.log(res.data)
        return true
    })
    .catch(err => { //catch errors
        console.log(err)
    })

})


//listen for GET requests on the /get-delivery-status endpoint 
app.get('/get-delivery-status', async (req, res) => {

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    //send the delivery  ID of the desired order to Drive API to receieve order updates
    const response = await client.getDelivery(externalDeliveryID)
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        console.log(err)
    })

    res.redirect('/')

})

//listen for PUT requests on the /cancel-delivery endpoint
app.put('/cancel-delivery', async (req, res) => {

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    //send a cancel-delivery request to Drive API to request cancellation
    const response = await client.cancelDelivery({
        external_delivery_id: externalDeliveryID
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })

})

//------------------------------------------------------------------
//Start the server
//------------------------------------------------------------------

app.listen(process.env.PORT || PORT, (err)=>{
    if (err) {
        console.log(err);
    }
    console.log(`Server running on port ${PORT}`)
})

//------------------------------------------------------------------
//Unused code that might become useful in future versions of the app
//------------------------------------------------------------------

//listen for PATCH requests on the /update-delivery endpoint - not currently running
// app.patch('/update-delivery', async (req, res) => {

//     //set the Drive API client IDs and secrets
//     const client = new DoorDashClient.DoorDashClient({
//         "developer_id": process.env.DEVELOPER_ID,
//         "key_id": process.env.KEY_ID,
//         "signing_secret": process.env.SIGNING_SECRET        
//     })

//     const response = await client.updateDelivery({

//     })

// })