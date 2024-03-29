//------------------------------------------------------------------
//Getting consts and requires etc. set up
//------------------------------------------------------------------

require('dotenv').config() //use dotenv for SECRETS
const express = require('express') //use express
const app = express() //set express const
const { randomUUID } = require('crypto') //i use this to create unique internal delivery id's 


//-----

// const MongoClient = require('mongodb').MongoClient //old code, keeping it around Just In Case™
const { MongoClient } = require('mongodb') //set up to use mongodb
const uri = process.env.DB_STRING //grab uri from .env
let dbName = 'branch-connector-database' //set database name
let db //initialize 'db' variable
const mongoDBClient = new MongoClient(uri) //mongoClient variable

//-----

const PORT = 2121 //set port, will need to change this later

//-----

const url = require('url') //need url access
const DoorDashClient = require('@doordash/sdk') //use the DoorDash Drive API
const { log } = require('console') //Drive API needs console access (i think i accidentally added this, and it isn't even necessary)
const jwt = require('jsonwebtoken') //use jwt for API auth

//------------------------------------------------------------------
//MongoDB connection and functions
//------------------------------------------------------------------

// Connect to Database
MongoClient.connect(uri)
    .then(client => {
        console.log(`Connected to "${dbName}" Database`)
        db = client.db(dbName)
    })

//------------------------------------------------------------------
//DoorDash Drive API setup
//------------------------------------------------------------------

//this contains the access key details to make API calls to DoorDash
const accessKey = {
    "developer_id": process.env.DEVELOPER_ID,
    "key_id": process.env.KEY_ID,
    "signing_secret": process.env.SIGNING_SECRET
}

//-----

//make a data object for getting a JWT
const data = { 
    aud: 'doordash',
    iss: accessKey.developer_id,
    kid: accessKey.key_id,
    exp: Math.floor(Date.now() / 1000 + 300),
    iat: Math.floor(Date.now() / 1000)
}

//-----

//headers for DoorDash JWT
const headers = {algorithm: 'HS256', header: {'dd-ver': 'DD-JWT-V1'}}

//-----

//JWT token creation
const token = jwt.sign(
    data,
    Buffer.from(accessKey.signing_secret, 'base64'),
    headers,
)

//-----

//confirm token was created
if (token) {
    console.log('JWT Generated');
}

//------------------------------------------------------------------
//Setting up for the server API
//------------------------------------------------------------------

app.set('view engine', 'ejs') //use ejs for HTML templates
app.use(express.static('public/')) //use a public folder to send static files
app.use(express.urlencoded({ extended: true })) //middleware to do something?
app.use(express.json()) //render some stuff as json

//------------------------------------------------------------------
//Routing
//------------------------------------------------------------------

// listen for root GET requests and render EJS when requested 
app.get('/', async (req,res) => {

    //This codeblock grabs all the addresses and menu items from DB for putting into ejs
    let addressesObj = await db.collection('addresses').find().toArray()
    let itemsObj = await db.collection('menu-items').find().toArray()
    let addresses = addressesObj[0].addresses
    let menuItems = itemsObj[0].items

    let payload = {
        "addresses": addresses,
        "items": menuItems
    }

    res.render('index.ejs', payload) 

})

//-----

app.get('/order-confirmation', async (req,res) => {

    let orderData = await db.collection('deliveries').find({}).sort({_id:-1}).limit(1).toArray()
    orderData = orderData[0]

    console.log(orderData)

    res.render('order-confirmation.ejs', orderData)

})

//-----

//Listen for GET requests on the /get-addresses endpoint
app.get('/get-addresses', async (req, res) => {

    let addressesObj = await db.collection('addresses').find().toArray()
    let payload = addressesObj[0].addresses

    res.send(payload)
    res.end()

})

//-----

//listen for POST requests on the /create-delivery endpoint
app.post('/create-delivery', async (req, res, next) => {

    //make a unique delivery id per delivery
    let ddUuid = randomUUID().slice(0,6)
    let externalDeliveryID = `D-${ddUuid}`

    //This codeblock grabs ALL the business addresses from DB
    let addressesObj = await db.collection('addresses').find().toArray()

    //make an 'reqDataObj' variable which pulls item and address data from the request body
    let reqDataObj = {
        items: req.body[0], //these are the items the user requested
        locations: req.body[1] //these are the user-selected addresses
    }

    //grab the items out of reqDataObj
    let items = reqDataObj.items

    //grab the two user-selected locations out of reqDataObj and store them into variables
    let currentLocation = JSON.parse(JSON.stringify(reqDataObj.locations[0].currentLocation))
    let deliveringLocation = JSON.parse(JSON.stringify(reqDataObj.locations[0].deliveringLocation))

    //go into the database addresses and pull out the addresses of the two user-selected addresses
    let pickupObj = JSON.parse(JSON.stringify(addressesObj[0].addresses[deliveringLocation]))
    let dropoffObj = JSON.parse(JSON.stringify(addressesObj[0].addresses[currentLocation]))

    //create strings from the newly created pickupObj and dropoffObj variables to pass
    //into the DoorDash API; addresses and phone numbers
    let pickupAddress = `${pickupObj.street}, ${pickupObj.cityName}, ${pickupObj.zipCode}`
    let pickupPhoneNumber = pickupObj.phoneNumber
    let dropoffAddress = `${dropoffObj.street}, ${dropoffObj.cityName}, ${dropoffObj.zipCode}`
    let dropoffPhoneNumber = dropoffObj.phoneNumber

    //set the Drive API client IDs and secrets
    const client = new DoorDashClient.DoorDashClient(accessKey)

    //send a createDelivery object to DoorDash to create a delivery
    const response = client.createDelivery({
        "items": items,
        external_delivery_id: externalDeliveryID,
        pickup_address: pickupAddress,
        pickup_phone_number: pickupPhoneNumber,
        dropoff_address: dropoffAddress,
        dropoff_phone_number: dropoffPhoneNumber
    })
    .then(ddResponse => {

        if (ddResponse){
            console.log('request success!')
        } else {
            res.end()
        }

        let data = ddResponse.data

        let dbPayload = {
            'externalDeliveryID': data.external_delivery_id,
            'deliveryStatus': data.delivery_status,
            'items': data.items,
            'pickupTimeEta': data.pickup_time_estimated,
            'dropoffTimeEta': data.dropoff_time_estimated,
            'supportRef': data.support_reference,
            'tracking': data.tracking_url
        }

        db.collection('deliveries').insertOne(dbPayload).then(result => {
            console.log("data inserted into database");
            res.redirect('/')
        })

    })
    .catch(err => { //catch errors
        console.log(err)
    })    

})

//-----

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

    res.end()

})

//-----

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

    res.end()

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