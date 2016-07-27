/* global it */
/* global describe */
/* global beforeEach */

var EventEmitter = require('../lib/events').default
var assert = require('chai').assert
var noop = function () {}


describe("Test Events", function () {
  
  var events
  
  beforeEach(function () {
    events = new EventEmitter()
  })
  
  describe("on()", function () {
    
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
      events._events['event'] = [noop, noop]
      
      assert.lengthOf(events.listeners('event'), 2)
      
      events.off('vent')
      
      assert.lengthOf(events.listeners('event'), 2)
    })
    
    it("removes all defined listeners for all events", function () {
      events._events['event'] = [noop, noop, noop]
      
      assert.lengthOf(events.listeners('event'), 3)
      
      events.off()
      
      assert.lengthOf(events.listeners('event'), 0)
    })
    
  })
  
  
  
})