//------------------------------------------------------------------
//Check local storage for specific entry, and set items if necessary
//------------------------------------------------------------------

//check local storage for an 'addresses' key, if it doesn't exist, then run the getAddresses() function
if (!localStorage.getItem('addresses')){
    console.log("No 'addresses' object in local storage. Creating object now...")
    getAddresses()
} else {
    console.log("'addresses' object already exists, no need to do anything")
}

//this function makes an api call to the server to pull address data from MongoDB and pop it into localStorage
async function getAddresses(){

    await fetch('/get-addresses', {
        method: "GET"
    })
    .then(async (res) => {
        let businessAddresses = await res.json()
        localStorage.setItem("addresses", JSON.stringify(businessAddresses))
    })

    console.log("'addresses' object successfully created in local storage")
    
}

//------------------------------------------------------------------
//
//------------------------------------------------------------------

let currentLocationSelect = document.getElementById('currentLocationSelect')
let deliveringLocationSelect = document.getElementById('deliveringLocationSelect')

currentLocationSelect.addEventListener('change', insertCurrentAddress);
deliveringLocationSelect.addEventListener('change', insertDeliveringAddress);

let currentStreet = document.querySelector('.currentStreet')
let currentCity = document.querySelector('.currentCityName')
let currentZip = document.querySelector('.currentZipCode')

let deliveringStreet = document.querySelector('.deliveringStreet')
let deliveringCity = document.querySelector('.deliveringCityName')
let deliveringZip = document.querySelector('.deliveringZipCode')

let addresses = JSON.parse(localStorage.getItem('addresses'))

currentStreet.innerHTML = addresses.branch1.street
currentCity.innerHTML = addresses.branch1.cityName
currentZip.innerHTML = addresses.branch1.zipCode

deliveringStreet.innerHTML = addresses.branch1.street
deliveringCity.innerHTML = addresses.branch1.cityName
deliveringZip.innerHTML = addresses.branch1.zipCode



function insertCurrentAddress(){
   
    let currentSelection = currentLocationSelect.value
    let currentSelectionArray =  String(currentSelection).split('')    
    let branchNumber = currentSelectionArray.slice(7).join('').toLowerCase()

    currentStreet.innerHTML = addresses[branchNumber].street
    currentCity.innerHTML = addresses[branchNumber].cityName
    currentZip.innerHTML = addresses[branchNumber].zipCode

}

function insertDeliveringAddress(){

    let deliveringSelection = deliveringLocationSelect.value
    let deliveringSelectionArray =  String(deliveringSelection).split('')    
    let branchNumber = deliveringSelectionArray.slice(10).join('').toLowerCase()

    deliveringStreet.innerHTML = addresses[branchNumber].street
    deliveringCity.innerHTML = addresses[branchNumber].cityName
    deliveringZip.innerHTML = addresses[branchNumber].zipCode

}





// Old code, prolly won't come back but I'm a hoarder while working on projects

// let addresses = {
//     branch1: {
//         street: "123 Example Street",
//         cityName: "Kissimmee, FL",
//         zipCode: "34746"
//     },
//     branch2: {
//         street: "345 Sample Road",
//         cityName: "Poinciana, FL",
//         zipCode: "33837"
//     },
//     branch3: {
//         street: "678 Model Blvd",
//         cityName: "Orlando, FL",
//         zipCode: "32789"
//     }
// }