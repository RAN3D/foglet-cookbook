# Foglet cookbook

Learn here how to use the [foglet-core](https://github.com/RAN3D/foglet-core) library to build fog computing applications.  

# Table of contents
* [Key concepts](#key-concepts)
* [Bulding a simple messaging app](#bulding-a-simple-messaging-app)
* [Discover the Protocol API](#discover-the-protocol-api)
* [RPS and Overlays](#rps-and-overlays)

# Key concepts

foglet-core relies on [WebRTC](https://webrtc.org/). And communications to servers are very limited to the first connection. Of course, it depends on **your** application. 

**...work in progress**

# Bulding a simple messaging app

This simple messaging app will be explained step by step.
But if you want to just see the code you can find it in the **examples/chat/** folder.

## Setting up the project

Firstly install the cookbook by: `npm install`

You will install 2 libraries: **foglet-core** and **foglet-signaling-server**

## Installing the foglet library

The **foglet-core** library is delivered with 2 bundles (minified and not minified) for web applications. These bundles are in **node_modules/foglet-core/dist/**.

## Let's build this app !

1) create an index.html (HTML)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Chat</title>

    <!-- Bootstrap -->
    <link href="./../utils/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <style>

  .link {
    stroke-width: 1.5px;
  }

  text {
    font: 10px sans-serif;
    pointer-events: none;
  }

  .col-md-4{
    border: 1px solid black;
  }


  </style>

  <body>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-0" style='background-color:#f1f1f1'>
        </div>
        <div class="col-md-10 col-md-offset-1">
          <div class='row'>
            <h1>Simple messaging application with foglet-core</h1>
          </div>
          
          <div>  
            <button class='btn btn-default' id='beginConnection' style='color:red' onclick='connection()'> Enter in the messaging app ! </button>
          </div>

          <div id='chatBox' style='display:none'>
            <div class="panel panel-default">
              <div class="panel-body">
                <div id='chatBoxMessage'></div>
              </div>
              <div class="panel-footer"><form id='submitMessage'><input name='message' type="text" value='' class="form-control" placeholder="Enter your text here !" aria-describedby="basic-addon1"><input type='submit' style='display:none'/></form></div>
            </div> 
          </div>

        </div>
      </div>
    </div><!-- /.container -->

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="./../utils/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="../utils/bootstrap/js/bootstrap.min.js"></script>
    <script src="./../../node_modules/foglet-core/dist/foglet.bundle.js"></script>
    <script src="./main.js"></script>
  </body>
</html>
```

I think this part is easy to understand. There is a first button to prompt a box to enter your pseudo. Once done a panel with the chat box will appear.

At the end of the file you will find this line in order to include the foglet bundle in your html file: 

```javascript
<script src="./../../node_modules/foglet-core/dist/foglet.bundle.js"></script>
```

Of course you can choose to import the minified bundle if you want(foglet.bundle.min.js)

Final step, add the main.js script to index.html file

```javascript
<script src="./main.js"></script>
```


2) create a main.js  (JavaScript)

```javascript
'use strict';

localStorage.debug = 'foglet-core:*';

const Foglet = require('foglet').Foglet;

let app = new Foglet({
  verbose: true, // want some logs ? switch to false otherwise
  rps: {
    type: 'spray-wrtc',
    options: {
      protocol: 'foglet-cookbook-chat', // foglet running on the protocol foglet-example, defined for spray-wrtc
      webrtc:	{ // add WebRTC options
        trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
        iceServers : [] // define iceServers in non local instance
      },
      timeout: 2 * 60 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
      delta: 10 * 1000, // spray-wrtc shuffle interval
      signaling: {
        address: 'http://localhost:3000/',
        // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
        room: 'foglet-cookbook-chat-room' // room to join
      }
    }
  }
});

/**
 * When we receive a message, add the message to the chatBox
 */
app.onBroadcast((id, msg) => {
  console.log(id, msg);
  addMessage(msg);
})

/**
 * When we submit a message, send to all other peers
 */
$('#submitMessage').submit(function () {
  let message = $('#submitMessage').find('input[name="message"]').val();
  let object = {
    pseudo: NAME,
    message
  };
  addMessage(object);
  app.sendBroadcast(object);
  return false;
});

/**
 * VARIABLES
 */
let NAME = 'Jon Snow';

/**
 * Connection function
 */
function connection(){
  // choose a pseudo
  let pseudo = prompt("Please enter your pseudo:", NAME);
  if (pseudo == null || pseudo == "") {
      // prompt cancelled, do nothing
  } else {
      NAME = pseudo;
      // prompt ok do the connection to the foglet
      // we active the foglet sharing mechanism
      app.share();
      // We connect this peer to the network on the room foglet-cookbook-chat-room by passing through the signaling server specified in options
      app.connection().then(() => {
        console.log('Connection succeeded.');
        drawChatBox();
        addMessage({
          pseudo: NAME,
          message: "You're now connected."
        });
      }).catch((e) => console.log('An error occured', e));
  }
}

/**
 * UTILS FUNCTIONS
 */
function drawChatBox() {
  $("#chatBox").show();
  $("#beginConnection").hide();
}
function addMessage(msg){
  $('#chatBoxMessage').append(`<p>${msg.pseudo}: ${msg.message}</p>`);
}
```


## Setting up a signaling server

A signaling server acts as a forwarding server in order to connect all new peers on the specified room.

If you are interested in discovering our implementation go to: https://github.com/RAN3D/foglet-signaling-server

But here we just want to run the server: `npm run signaling`

It will run a signaling server on the port 3000, the address to put in the main.js is http://localhost:3000/. 

## Breaking the ICE

Easy isn't it ? let's talk about Ice, it's cold and hard but not ununderstandable ahah.

A complete and usefull documentation is available [here](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols)

But in a short way, when your are in a local network you does not need to use ICE. But if you want to contact a friend on the other side of the world you have to pass through firewalls and cie. And now you have to use ICE for this purpose (STUN and TURN).

I suggest you to read the previous link. This is very interesting and you will probably find more answers than here ! 

## Final version

Now if you want to make your application accessible to the world. There is an elegant solution:

**... work in progress**

# Discover the Protocol API

## Protocols ? What's for ?

## Enhancing our messaging app

## Hooks and fishes

# RPS and Overlays
