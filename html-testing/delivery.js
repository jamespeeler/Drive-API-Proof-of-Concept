let orderButton = document.getElementById('orderBtn') //make an 'orderButton' variable which grabs the "order button" from EJS/HTML and add a click event listener
orderButton.addEventListener('click', testGetFormValues)// orderButton.addEventListener('click', createDelivery)

//create a 'getFormValues' function that will grab all of the form values and combine them into an object
function getFormValues(){

    const inputContainer = document.getElementById('orderItems') //set 'inputContainer' to the WHOLE table
    const checkboxList = inputContainer.querySelectorAll('.item') //set 'checkboxList' to be ALL of the checkbox elements
    const checkboxArray = Array.from(checkboxList) //set 'fieldArray' to be an array from 'fieldList'

    const quantityList = inputContainer.querySelectorAll('.quantity')
    const quantityArray = Array.from(quantityList)
    let quantityValues = []
    quantityArray.forEach((e) => {
        if (e.value != ""){
            quantityValues.push(e.valueAsNumber)
        } else {
            quantityValues.push(0)
        }
    })

    console.log(checkboxArray, quantityArray, quantityValues)

    const payload = ":D"

    //make a payload from the 'fieldArray' array. 
    // const payload = fieldArray.reduce((obj, field) => {
    //     if (field.name === 'items') {//if the field has a name of 'items'
    //         if (field.checked){//and if 'field' is checked
    //             obj['order_value'] == parseInt(field.value) //set an [order_value] property to the 'field' value
    //         }
    //     } else { //otherwise set a [field.name] value to 'field.value'
    //         obj[field.name] = field.value
    //     }

    //     return obj
    // }, {order_value: 0}
    // )
    console.log(payload);
    return payload

}

function testGetFormValues(){
    console.log(getFormValues());
}



//create a 'getFee' function to make a fee object
async function getFee(){
    const payload = getFormValues() //use the getFormValues function and store the result in 'payload'
    const finalPayload = JSON.stringify(payload) //stringify the payload, and store that into 'finalPayload

    const formInput = document.querySelector('form') //make a formInput const, and store the form elements into it

    if (formInput.checkValidity()){ //if the form has been filled out

        const response = await fetch('/create-delivery-quote', { //make a fetch request to the create-delivery-quote server API endpoint
            method: "POST",
            body: finalPayload,
            headers: {"Content-Type" : "application/json"}
        })
        .then((res) => {
            return res.json() //parse response as json and return
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })

        const deliveryFee = document.getElementById('fee') //create a 'deliveryFee' const that stores the element with the 'fee' ID
        const clothingTotal = document.getElementById('price') //create a 'clothingTotal' const that stores the element with the 'price' ID
        const orderTotal = document.getElementById('total') //create an 'orderTotal' const that stores the element with the 'total' ID

        clothingTotal.textContent = `$${(menuItems / 100).toFixed(2)}` //set the text content of the consts to the appropriate values
        deliveryFee.textContent = `$${(response.data.fee / 100).toFixed(2)}`
        orderTotal.textContent = `$${((Number(menuItems) + response.data.fee) / 100).toFixed(2)}`

        console.log('I filled it out');
    } else {
        console.log('Fill out the form');
    }
}


//create a 'createDelivery' function that will send a post request to DoorDash and create a new delivery
async function createDelivery(){
    const payload = getFormValues() //use the getFormValues function and store the result in 'payload'
    const finalPayload = JSON.stringify(payload) //stringify the payload, and store that into 'finalPayload

    const formInput = document.querySelector('form') //make a formInput const, and store the form elements into it
    const menuBoxes = document.querySelectorAll('input[type=checkbox]:checked') //make a 'menuBoxes' const and store ALL of the checkboxes THAT HAVE BEEN CHECKED into it

    if (formInput.checkValidity() && menuBoxes.length > 0){ //if the form has been filled out, and at least 1 check box has been ticked

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

        if (response){ //if the 'response' promise is fulfilled
            document.documentElement.innerHTML = response // put the response into the dom
        } else if (formInput.checkValidity() && menuBoxes.length === 0){ //if the form has been filled out but no checkboxes have been ticked
            alert('Please select a menu item') //send an alert to the browser window
        } else {
            return
        }
    }


}