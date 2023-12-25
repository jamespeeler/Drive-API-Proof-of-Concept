//set a menuItems variable to hold our price
let menuItems = 0

//grab all of the HTML elements with the 'clothing' class and put them into 'clothingItems'
const clothingItems = document.getElementsByClassName('clothing')
//grab the HTML element with the 'price' ID and put it into 'clothingTotal'
const clothingTotal = document.getElementById('price')

//use a for...of loop to add event listeners to the 'clothingItems' array, and they will call the 'callFeeAPI' function on click
for (const clothing of clothingItems){
    clothing.addEventListener('click', callFeeAPI)
}


//make a function to call the Fee API
function callFeeAPI({target}){//when the checkbox is checked, the event listener will call this function ON the checkbox itself
    if (target.className === 'clothing' && target.checked){//if the checkbox has a class of 'clothing' AND a property of 'checked'
        menuItems += parseInt(target.value) //then check the value of the checkbox itself, and add it to 'menuItems'
    } else if (target.className === 'clothing' && !target.checked){//if the target checkbox has a class of 'clothing' AND does NOT have a property of 'checked
        menuItems -= parseInt(target.value) //then check the value of of the checkbox itself, and subtract it from 'menuItems'
    }

    //edit the text content of clothingTotal to be the price (which would be 'menuItems' converted to a price format)
    clothingTotal.textContent = `$${(menuItems / 100).toFixed(2)}`
}