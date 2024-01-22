
# DoorDash Drive API Proof-of-concept

This is a simple site I created using DoorDash's Drive API. The code is a bit rough-and-ready, as it is not at a place to be used in production. But, it's a good way to see the Drive API in action.

There are, I'm sure, about a million edge-cases to be discovered. There is no MVC or OOP to be found (yet), and I am no designer - you have been warned.

The purpose of the site is to provide businesses with a solution to a common problem:

Say you are a cafe owner with two stores. At your main store, you are hit with a huge rush, and you run out of store-branded cups. You have plenty of cups at your second location, but you are losing business at your main store. You could send an employee to drive from one store to the other with the inventory, but then you are losing an entire worker for the time it takes for them to travel. Plus, the business may be held liable for any accidents that happen. 

So, what this app does is connects the business to DoorDash's Drive API, and allows the store to select from pre-determined items. Then, a DoorDash Dasher will be assigned to pick up the items from one store, and deliver them where they are needed.

![Screenshot 2024-01-22 2 45 41 PM](https://github.com/jamespeeler/business-branch-delivery-service/assets/44689036/d63cba6a-e5c7-4a01-8542-b61389712622)

See! Super simple.

## Usage

To use this project, simply run the server.js file using Node, then connect to localhost:2121 using your browser of choice. You can change the PORT variable to something you prefer, I just happen to like port 2121.


## Documentation

### Front end

The front end for this site is pretty simple, and with a simple concept. 

You will find two drop-down select boxes. You select the business that needs the delivery on the left, and the business that will be providing the inventory on the right.

Then, you will need to select the items that you need, and the quantity of each.

And that's it! You can then place the order, and that's when the backend magic happens.

Also: To use DoorDash's Drive API, you must provide a place for the user to see DoorDash's provided support ID - so I have provided a very basic place to see that. Eventually there will be a more polished method of handling this, but for now it's fairly primitive - it gets the job done.

### Back-end

Oh boy. This is the fun stuff. In the backend, you're going to find... a lot. Try not to run away screaming. This started out small, but developed into something larger. And so, the organization is... hectic for the time being.

The main function of the backend is to listen for GET/PUT/POST requests and interact with the Drive API. Generally speaking, if you're digging through a random person's backend NodeJS code for an obscure API, I assume you'll be able to sus out what's going on - plus the code is very well commented - but I'll provide some basic explanations for the general flow:

There are a handful of JS files in the project:

/server.js, /public/js/delivery.js, and /public/js/main.js

The server.js file connects to a database where information about businesses is stored. Then it listens for requests from the front-end and responds accordingly. The belle of the ball here is the '/create-delivery' endpoint. If you are using the Drive API, this will likely be the meat of your application.

There are two client-side js files - delivery.js & main.js: 

The main.js file is simple - it will store address data from the databse into local storage, that way it can be used to paint the DOM with relevant data. 

The delivery.js file listens for the button press, then takes all of the user-inputted data and forms it into a request to the server, where it is sent to DoorDash to create a delivery.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

`DEVELOPER_ID` 

`KEY_ID`

`SIGNING_SECRET`

`DB_STRING`

The DEVELOPER_ID, KEY_ID, and SIGNING_SECRET variables come from DoorDash. When you sign up as a developer, they will give you these values.

The DB_STRING variable is where you will put your MongoDB connection string. If you use another database provider, you'll need to work that out on your own if you plan to use this code.

Store the .env file on the root directory - same level as server.js
