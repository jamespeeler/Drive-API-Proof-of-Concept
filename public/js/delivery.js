//------------------------------------------------------------------
//Set up event listeners
//------------------------------------------------------------------

let orderButton = document.getElementById('orderBtn') //make an 'orderButton' variable which grabs the "order button" from EJS/HTML and add a click event listener
orderButton.addEventListener('click', createDelivery)// orderButton.addEventListener('click', createDelivery)

//------------------------------------------------------------------
//Set up local addresses and menuItems objects for testing when I don't have internet access
//------------------------------------------------------------------

// const addressesObject = {
//     branch1: {
//         street: "123 Example Street",
//         cityName: "Kissimmee, FL",
//         zipCode: "34746",
//         phoneNumber: "+14078680001"
//     },
//     branch2: {
//         street: "345 Sample Road",
//         cityName: "Poinciana, FL",
//         zipCode: "33837",
//         phoneNumber: "+14078680002"
//     },
//     branch3: {
//         street: "678 Model Blvd",
//         cityName: "Orlando, FL",
//         zipCode: "32789",
//         phoneNumber: "+14078680003"
//     }
// }

// const menuItems = {
//     items : [ 'milk', 'cups', 'lids', 'straws', 'napkins' ]
// }

//------------------------------------------------------------------
//Set up functions
//------------------------------------------------------------------

//create a 'getFormValues' function that will grab all of the items and form values and combine them into an object
function getFormValues(){

    const inputContainer = document.getElementById('orderItems') //set 'inputContainer' to the WHOLE table
    const itemList = inputContainer.querySelectorAll('.item') //set 'itemList' to be ALL of the checkbox elements
    const itemArray = Array.from(itemList) //set 'fieldArray' to be an array from 'fieldList'

    const quantityList = inputContainer.querySelectorAll('.quantity') //set 'quantityList' to ALL of the '.quantity' elements
    const quantityArray = Array.from(quantityList) //make an array from 'quantityList'
    let quantityValues = [] // make an empty array to store the user-inputted values

    quantityArray.forEach((e) => {//loop through the 'quantityArray' array
        if (e.value != ""){//if the user has entered a number into the field
            quantityValues.push(e.valueAsNumber) //then push that number into the 'quantityValues' array
        } else if (e.value === '0') { //otherwise, if a user inputted a 0
            quantityValues.push(0) //then push the 0
        } else { //if the field is empty, just push a 0
            quantityValues.push(0)
        }
    })

    let payload = [] //create an empty payload object to combine the data into

    for (let i = 0; i < itemArray.length; i++){ //loop checkboxArray.length number of times
        let currentObj = {} //initialize an object to push into the payload
        currentObj['name'] = itemArray[i].dataset.item //key 'item' is equal to the item pulled from HTML
        currentObj['quantity']= quantityValues[i] //key 'amount' is equal to the user-inputted number from HTML
        payload.push(currentObj) //push the 'currentObj' object into 'payload'
    }

    payload = payload.filter(e => e.quantity !== 0) //filter 'payload' to only include entries with amounts greater than 0

    console.log(`getFormValues payload from delivery.js:`, payload)

    return payload
}

//-----

//create a 'getSelectionData' function that will grab the data from the 'select' dropdown menus and return some address data
function getAddressData(){

    //set two variables, each grabbing the individual select elements
    let currentLocationSelect = document.getElementById('currentLocationSelect')
    let deliveringLocationSelect = document.getElementById('deliveringLocationSelect')

    //set two variables, each one grabbing the relative index of the currently selected option
    let currentLocationSelectIndex = currentLocationSelect.selectedIndex
    let deliveringLocationSelectIndex = deliveringLocationSelect.selectedIndex

    //set two variables, each one grabbing the first index from the classList of the select menu (which contains the branch number)
    let currentLocation = currentLocationSelect[currentLocationSelectIndex].classList[1]
    let deliveringLocation = deliveringLocationSelect[deliveringLocationSelectIndex].classList[1]

    //set up a payload array to push data into
    let payload = []

    payload.push({
        currentLocation: currentLocation,
        deliveringLocation: deliveringLocation
    })


    //if statements which check the 'currentLocation' and 'deliveringLocation' variables and push data based on the response
    //this codeblock is used when i don't have internet access
    // if (currentLocation === 'branch1'){
    //     payload.push({currentLocation: addressesObject.branch1})
    // } else if (currentLocation === 'branch2'){
    //     payload.push({currentLocation: addressesObject.branch2})
    // } else {
    //     payload.push({currentLocation: addressesObject.branch3})
    // }

    // if (deliveringLocation === 'branch1'){
    //     payload.push({deliveringLocation: addressesObject.branch1})
    // } else if (deliveringLocation === 'branch2'){
    //     payload.push({deliveringLocation: addressesObject.branch2})
    // } else {
    //     payload.push({deliveringLocation: addressesObject.branch3})
    // }

    console.log(`getSelectionData payload from delivery.js:`, payload)

    return payload
}

//-----

//create a 'createDelivery' function that will send a post request to DoorDash and create a new delivery
async function createDelivery(){

    const payload = [getFormValues(), getAddressData()]
    
    const finalPayload = JSON.stringify(payload) //stringify the payload, and store that into 'finalPayload

    const response = await fetch('/create-delivery', { //make a fetch request to the server API to create a new delivery
        method: "POST",
        body: finalPayload,
        headers: {"Content-Type" : "application/json"}
    })
    .then((res) => {
        return res.text()
    })
    .catch((err) => {
        console.log(`Error: ${err}`)
        return false
    })
}