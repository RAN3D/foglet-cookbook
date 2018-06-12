Getting started
===============

To demonstrate all key concepts of a Foglet, let’s build a Hello world
aplication. it will be a simple Foglet that broadcast the message *hello
world!* to all connected browsers.

All code written during this tutorial can be found on this repository.

Setting up the project
----------------------

First, setup a new npm project

::

   mkdir foglet-hello-world
   cd foglet-hello-world
   npm init

Next, install the core library and the development tools for foglet apps

::

   npm install --save foglet-core
   npm install --save-dev foglet-scripts

Edit your ``package.json`` file to add the following fields:

::

   "scripts: {
     "start": "foglet-scripts start"
   }

Now, create the following files

**index.html**

.. code-block:: html

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

**app.js**

.. code-block:: javascript

   'use strict'

   console.log('hello world')

To test your installation, open ``index.html`` in a browser, you should
see **hello world!** in the console.

Let’s build the real app now!
-----------------------------

Now that’s your project is ready, let’s create our Hello World Foglet.
Here is the complete code to put in **index.js**.

**NB:** Notice that we use a ``require`` style syntax here to import
dependencies, as foglet-core bundle is built using
`Browserify <http://browserify.org/>`__

.. code-block:: javascript

   'use strict'

   const Foglet = require('foglet').Foglet

   const app = new Foglet({
     verbose: true, // activate logs. Put false to disable them in production!
     rps: {
       type: 'spray-wrtc',
       options: {
         protocol: 'foglet-hello-world', // name of the protocol run by your app
         webrtc:   { // WebRTC options
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

Now, run ``npm start`` to start the signaling server, and then open
**index.html** in two tabs, to create two distinct peers.

Open the console, wait for connections to be done, and then click those
damn buttons! You should see messages popping in each tab!

Setting up a signaling server
-----------------------------

A signaling server acts as a forwarding server in order to connect all
new peers on the specified room. You can access an implenmentation at
https://github.com/RAN3D/foglet-signaling-server

However, if you juste need a signaling server out of the box, the foglet
build tools contains one that can be run with ``foglet-scripts start``.
