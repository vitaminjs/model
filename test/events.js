/* global it */
/* global describe */
/* global beforeEach */

var EventEmitter = require('../lib/events').default
var assert = require('chai').assert
var noop = function () {}


describe("Test Events", function () {
  
  var events
  
  describe("on()", function () {
    
    beforeEach(function () {
      events = new EventEmitter()
    })
    
    it("stores handlers by event name", function () {
      events.on('event', function() {})
      
      assert.lengthOf(events.listeners('event'), 1)
      assert.isFunction(events.listeners('event')[0])
    })
    
    it("attaches the same handler for events separated by a space", function () {
      events.on('ev1 ev2', noop)
      
      assert.lengthOf(events.listeners('ev1'), 1)
      assert.lengthOf(events.listeners('ev2'), 1)
      assert.equal(events.listeners('ev1')[0], events.listeners('ev2')[0])
    })
    
  })
  
  describe("off()", function () {
    
    beforeEach(function () {
      events = new EventEmitter()
    })
    
    it("removes a specific listener", function () {
      var someHandler = noop
      
      events.on("event", someHandler)
      assert.lengthOf(events.listeners('event'), 1)
      
      events.off('event', someHandler)
      assert.lengthOf(events.listeners('event'), 0)
    })
    
    it("removes all handlers of a specified event", function () {
      events.on('event', noop).on("event", noop)
      
      assert.lengthOf(events.listeners('event'), 2)
      
      events.off('event')
      
      assert.lengthOf(events.listeners('event'), 0)
    })
    
    it("removes all defined listeners for all events", function () {
      events.on('event', noop).on("event", noop).on("event", noop)
      
      assert.lengthOf(events.listeners('event'), 3)
      
      events.off()
      
      assert.lengthOf(events.listeners('event'), 0)
    })
    
  })
  
  describe("emit()", function () {
    
    var counter
    
    beforeEach(function () {
      counter = 0
      events = new EventEmitter()
      
      events
        .on('event', function () {
          assert.equal(++counter, 1)
        })
        .on('event', function () {
          assert.equal(++counter, 2)
        })
    })
    
    it("triggers some event by name", function () {
      events.emit('event')
    })
    
    it("triggers events with parameters passed in", function () {
      events.on('event', function (arg) {
        counter = 0
        assert.equal(arg, 'foo')
      })
      
      events.emit('event', "foo").then(function() {
        assert.equal(counter, 0)
      })
    })
    
    it("fails if an error is thrown", function() {
      events.on('event', function () {
        throw new Error("Fail !")
      })
      
      events.emit('event').catch(function(err) {
        assert.instanceOf(err, Error)
        assert.equal(err.message, "Fail !")
      })
    })
    
  })
  
})