Basic communication
===================

Basically, a foglet offers five communication primitives:
``unicast``, ``multicast``, ``broadcast``, ``streaming unicast`` and ``streaming broadcast``.
They can be used to exchange messages between peers in the network.

We now review these four primitives to demonstrate their use.

Unicast communication
^^^^^^^^^^^^^^^^^^^^^

A peer can use the *unicast* primitive to send a message to one of its direct neighbour.
However, it can't use it to send a message to a peer that is not one of its neighbours!

.. code-block:: javascript

   // Get the ID of my first neighbour
   const id = my_foglet.getNeighbours[0]

   my_foglet.sendUnicast(id, 'Hi neighbour! Do you want to party tonight?')


A foglet can listen for incoming unicast messages using the ``onUnicast`` method,
that registers a callback executed for each unicast message received by the foglet.

This callback is called with two parameters:
  - ``id`` the ID of the peer who sent the message
  - ``message`` the message received

Notice that ``id`` can be used to contact the peer using ``sendUnicast``.

.. code-block:: javascript

   my_foglet.onUnicast((id, message) => {
     console.log(`Unicast message received from ${id}: ${message}`);

     // anwser to our neighbour
     my_foglet.sendUnicast(id, 'Sure. Can I bring a salad?')
   })


Multicast communication
^^^^^^^^^^^^^^^^^^^^^^^

In real-world applications, one may want to send a message to several neighbours.
Instead of repeateadly send a unicast messages to each peer individually,
the ``multicast`` primitive allow a foglet to send a unicast message to a set of neighbours.
These messages are received by others peers as *regular unicast messages*.

.. code-block:: javascript

   // Get the IDs of all neighbours
   const ids = my_foglet.getNeighbours

   my_foglet.sendMulticast(ids, 'Everyone, free salad at my place tonight!')


Broadcast communication
^^^^^^^^^^^^^^^^^^^^^^^

Where the ``unicast`` and ``multicast`` primitives allow to contact neighbours, the ``broadcast`` primitive
allow a peer to send a message to **all peers in the network**.
This broadcast is done using a flooding algorithm and implements a **causal broadcast**, which guarantee the
following properties:

- *Validity:* if a peer received a message ``m`` at least once, then ``m`` has been diffused at least once by another peer.
- *Uniformity:* if a peer received a message ``m``, then all peers will receive ``m``.
- *FIFO reception:* if a peer broadcast a message ``m`` and next another message ``m'``, then no peer will receive ``m'`` before ``m``.
- *Causal reception:* if a peer receive a message ``m`` and next broadcast a message ``m'``, then no peer will receive ``m'`` before ``m``.

.. code-block:: javascript

   my_foglet.sendBroadcast('Can I borrow some salt from someone?')

Like ``unicast`` messages, a foglet can listen for incoming broadcast messages
using the ``onUnicast`` method, that registers a callback executed
for each broadcast message received by the foglet.

This callback is called with two parameters:
  - ``id`` the ID of the peer who sent the message
  - ``message`` the message received

.. code-block:: javascript

   my_foglet.onBroadcast((id, message) => {
     console.log(`Broadcast message received from ${id}: ${message}`);
   })

**Warning:** contrary to unicast messages, a broadcast message can be recevied from any peer in the network.
Thus, the ``id`` can be used to conctact the emitter (using ``sendUnicast``) at the condition
that the emitter is a neighbour of the receiver. Otherwise, the message will not be sent.


Streaming unicast and broadcast
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
