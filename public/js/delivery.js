let orderButton = document.getElementById('orderBtn') //make an 'orderButton' variable which grabs the "order button" from EJS/HTML and add a click event listener
orderButton.addEventListener('click', createDelivery)// orderButton.addEventListener('click', createDelivery)

//create a 'getFormValues' function that will grab all of the form values and combine them into an object
function getFormValues(){

    const inputContainer = document.getElementById('orderItems') //set 'inputContainer' to the WHOLE table
    const checkboxList = inputContainer.querySelectorAll('.item') //set 'checkboxList' to be ALL of the checkbox elements
    const checkboxArray = Array.from(checkboxList) //set 'fieldArray' to be an array from 'fieldList'

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

    for (let i = 0; i < checkboxArray.length; i++){ //loop checkboxArray.length number of times
        let currentObj = {} //initialize an object to push into the payload
        currentObj['name'] = checkboxArray[i].dataset.item //key 'item' is equal to the item pulled from HTML
        currentObj['quantity']= quantityValues[i] //key 'amount' is equal to the user-inputted number from HTML
        payload.push(currentObj) //push the 'currentObj' object into 'payload'
    }

    payload = payload.filter(e => e.quantity !== 0) //filter 'payload' to only include entries with amounts greater than 0

    console.log(payload)

    return payload
}





//create a 'createDelivery' function that will send a post request to DoorDash and create a new delivery
async function createDelivery(){
    const payload = getFormValues() //use the getFormValues function and store the result in 'payload'
    const finalPayload = JSON.stringify(payload) //stringify the payload, and store that into 'finalPayload

    // const formInput = document.querySelector('form') //make a formInput const, and store the form elements into it
    // const menuBoxes = document.querySelectorAll('input[type=checkbox]:checked') //make a 'menuBoxes' const and store ALL of the checkboxes THAT HAVE BEEN CHECKED into it

    // if (formInput.checkValidity() && menuBoxes.length > 0){ //if the form has been filled out, and at least 1 check box has been ticked

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
    // }


}
