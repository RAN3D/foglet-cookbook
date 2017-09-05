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