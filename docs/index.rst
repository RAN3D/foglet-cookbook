.. foglet documentation master file, created by
   sphinx-quickstart on Tue Jun 12 08:54:08 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to foglet's documentation!
==================================

.. toctree::
   :maxdepth: 2

   getting_started
   basic_comm
   ice


Key concepts
============
``foglet-core`` allows to build fog computing applications, *i.e.*,
applications that runs in a *fog of browsers*. Such application is
called a **Foglet**.

A Foglet connect browsers through a Random Peer Sampling (RPS) overlay
network [1]. Such a network approximates a random graph where each data
consumer is connected to a fixed number of neighbors. It is resilient to
churn, to failures and communication with neighbors is a zero-hop.

In the context of browsers, basic communications rely on
`WebRTC <https://webrtc.org/>`__ to establish a data-channel between
browsers and SPRAY [2] to enable RPS on WebRTC. Each browser maintains a
set of neighbors K called a view that is a random subset of the whole
network. To keep its view random, a data consumer renews it periodically
by shuffling its view with the view of a random neighbor.

As a Foglet rely on WebRTC for communication, it requires **a signaling
server** to disocver new peers and **ICE servers** to connect browsers,
throught NAT for example. These points will be discussed in details
later.


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
