let currentLocationSelect = document.getElementById('currentLocationSelect')
let deliveringLocationSelect = document.getElementById('deliveringLocationSelect')

currentLocationSelect.addEventListener('change', insertCurrentAddress)
deliveringLocationSelect.addEventListener('change', insertDeliveringAddress)

let currentStreet = document.querySelector('.currentStreet')
let currentCity = document.querySelector('.currentCityName')
let currentZip = document.querySelector('.currentZipCode')

let deliveringStreet = document.querySelector('.deliveringStreet')
let deliveringCity = document.querySelector('.deliveringCityName')
let deliveringZip = document.querySelector('.deliveringZipCode')

//need to make an api call to the server to create an addresses object on page load

//need to populate html spans with address data on select change 

//grabbing the class information from html, referencing that against the addresses object, then using that 
//to populate the spans, similar to how it works when the server pulls the info from the db
//and formats it for doordash 

let addresses = {
    branch1: {
        street: "123 Example Street",
        cityName: "Kissimmee, FL",
        zipCode: "34746"
    },
    branch2: {
        street: "345 Sample Road",
        cityName: "Poinciana, FL",
        zipCode: "33837"
    },
    branch3: {
        street: "678 Model Blvd",
        cityName: "Orlando, FL",
        zipCode: "32789"
    }
}

currentStreet.innerHTML = addresses.branch1.street
currentCity.innerHTML = addresses.branch1.cityName
currentZip.innerHTML = addresses.branch1.zipCode

deliveringStreet.innerHTML = addresses.branch1.street
deliveringCity.innerHTML = addresses.branch1.cityName
deliveringZip.innerHTML = addresses.branch1.zipCode



function insertCurrentAddress(){
   
    let currentSelection =  currentLocationSelect.value

    if (currentSelection === 'currentBranch1'){
        currentStreet.innerHTML = addresses.branch1.street
        currentCity.innerHTML = addresses.branch1.cityName
        currentZip.innerHTML = addresses.branch1.zipCode
    } else if (currentSelection === 'currentBranch2'){
        currentStreet.innerHTML = addresses.branch2.street
        currentCity.innerHTML = addresses.branch2.cityName
        currentZip.innerHTML = addresses.branch2.zipCode
    } else if (currentSelection === 'currentBranch3'){
        currentStreet.innerHTML = addresses.branch3.street
        currentCity.innerHTML = addresses.branch3.cityName
        currentZip.innerHTML = addresses.branch3.zipCode
    }

    
}

function insertDeliveringAddress(){

    let deliveringSelection = deliveringLocationSelect.value
    
    if (deliveringSelection === 'deliveringBranch1'){
        deliveringStreet.innerHTML = addresses.branch1.street
        deliveringCity.innerHTML = addresses.branch1.cityName
        deliveringZip.innerHTML = addresses.branch1.zipCode
    } else if (deliveringSelection === 'deliveringBranch2'){
        deliveringStreet.innerHTML = addresses.branch2.street
        deliveringCity.innerHTML = addresses.branch2.cityName
        deliveringZip.innerHTML = addresses.branch2.zipCode
    } else if (deliveringSelection === 'deliveringBranch3'){
        deliveringStreet.innerHTML = addresses.branch3.street
        deliveringCity.innerHTML = addresses.branch3.cityName
        deliveringZip.innerHTML = addresses.branch3.zipCode
    }
}