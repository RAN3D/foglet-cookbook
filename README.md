# Foglet cookbook

Learn here how to use the [foglet-core](https://github.com/RAN3D/foglet-core) library to build fog computing applications.  

# Table of contents
* [Key concepts](#key-concepts)
* [Foglet Hello World](#foglet-hello-world)
* [Discover the Protocol API](#discover-the-protocol-api)
* [RPS and Overlays](#rps-and-overlays)

# Key concepts

`foglet-core` allows to build fog computing applications, *i.e.*, applications that runs in a *fiog of browsers*.
Such application is called a **Foglet**.

A Foglet connect browsers through a Random Peer
Sampling (RPS) overlay network [1]. Such a network approximates a random graph where
each data consumer is connected to a fixed number of neighbors. It is resilient to churn, to
failures and communication with neighbors is a zero-hop.

In the context of browsers, basic communications rely on [WebRTC](https://webrtc.org/) to establish a
data-channel between browsers and SPRAY [2] to enable RPS on WebRTC. Each browser
maintains a set of neighbors K called a view that is a random subset of the whole network.
To keep its view random, a data consumer renews it periodically by shuffling its view with
the view of a random neighbor.

As a Foglet rely on WebRTC for communication, it requires **a signaling server** to disocver new peers 
and **ICE servers** to connect browsers, throught NAT for example.
These points will be discussed in details later.

# Foglet Hello World

To demonbstrate all key concepts of a Foglet, let's build a Hello world aplication.
it will be a simple Foglet that broadcast the message *hello world!* to all connected browsers.

All code written during this tutorial can be found on this repository.

## Setting up the project

First, setup a new npm project
```
mkdir foglet-hello-world
cd foglet-hello-world
npm init
```

Next, install the core library and the development tools for foglet apps
```
npm install --save foglet-core
npm install --save-dev foglet-scripts
```

Edit your `package.json` file to add the following fields:
```json
"scripts: {
  "start": "foglet-scripts start"
}
```

Now, create the following files

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Foglet Hello world</title>
  </head>

  <body>
    <button id="send-message">Hello World!</button>
    <!-- foglet-core bundle -->
    <script src="node_modules/foglet-core/dist/foglet.bundle.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

**app.js**
```javascript
'use strict'

console.log('hello world')
```

To test your installation, open `index.html` in a browser, you should see **hello world!** in the console.

## Let's build the real app now!

Now that's your project is ready, let's create our Hello World Foglet.
Here is the complete code to put in **index.js**.

**NB:** Notice that we use a `require` style syntax here to import dependencies, as foglet-core bundle is built using [Browserify](http://browserify.org/)
```javascript
'use strict'

const Foglet = require('foglet-core').Foglet

const app = new Foglet({
  verbose: true, // activate logs. Put false to disable them in production!
  rps: {
    type: 'spray-wrtc',
    options: {
      protocol: 'foglet-hello-world', // name of the protocol run by your app
      webrtc:	{ // WebRTC options
        trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
        iceServers : [] // iceServers, we lkeave it empty for now
      },
      timeout: 2 * 60 * 1000, // WebRTC connections timeout
      delta: 10 * 1000, // spray-wrtc shuffle interval
      signaling: { //
        address: 'http://localhost:3000/',
        room: 'foglet-hello-world-room' // room to join
      }
    }
  }
})

// connect to the signaling server
app.share()

// connect our app to the fog
app.connection()
.then(() => {
  console.log('application connected!')

  // listen for incoming broadcast
  app.onBroadcast((id, msg) => {
    console.log('I have received a message from peer', id, ':', msg)
  })

  // send our message each time we hit the button
  const btn = document.getElementById("send-message")
  btn.addEventListener("click", () => {
    app.sendBroadcast('hello World!')
  }, false)
})
.catch(console.error) // catch connection errors
```

Now, run `npm start` to start the signaling server, and then open **index.html** in two tabs, to create two distinct peers.

Open the console, wait for connections to be done, and then click those damn buttons!
You should see messages popping in each tab!

## Setting up a signaling server

A signaling server acts as a forwarding server in order to connect all new peers on the specified room.
You can access an implenmentation at https://github.com/RAN3D/foglet-signaling-server

However, if you juste need a signaling server out of the box, the foglet build tools contains one that can
be run with `foglet-scripts start`.

## Breaking the ICE

**Work in prgress**

A complete and usefull documentation is available [here](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols)

In short: when your are in a local network, you don't need to use ICE. But if you want to contact a peer on the other side of the world, you may have to pass through firewalls and all sort of things. ICE servers are here to resolve this.

# Discover the Protocol API

## Protocols ? What's for ?

## Enhancing our messaging app

## Hooks and fishes

# RPS and Overlays
