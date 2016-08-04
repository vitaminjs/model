/* global it */
/* global describe */
/* global beforeEach */

var assert = require('chai').assert
var Model = require('../lib/model').default

describe("Test Model", function() {
  
  describe("extend()", function() {

    it("returns a sub model class", function() {
      var A = Model.extend()
      var B = A.extend()
      var C = B.extend({
        constructor: function () {
          B.call(this)
        }
      })

      assert.instanceOf(A.prototype, Model)
      assert.instanceOf(B.prototype, Model)
      assert.instanceOf(C.prototype, Model)
    })

    it("adds instance properties", function() {
      var A = Model.extend({
        prop1: "foo",
        method1: function() {}
      })
      var B = A.extend({
        method2: function() {}
      })

      assert.property(A.prototype, 'prop1')
      assert.property(A.prototype, 'method1')
      assert.property(B.prototype, 'method2')
    })
    
    it("adds static properties", function () {
      var A = Model.extend(null, {
        foo: () => {}
      })
      
      assert.property(A, 'foo')
      assert.isFunction(A.foo)
    })

  })

  describe("Data manipulation", function() {

    var model

    beforeEach(function() {
      model = new Model({ name: "foo", age: 35 })
      model.syncOriginal()
    })

    it("sets data properly", function() {
      assert.ok(model.has('name'))
      assert.ok(model.has('age'))
      assert.equal(model.get('age'), 35)
      assert.equal(model.get('name'), "foo")
      
      model.set('age', 40)
      assert.equal(model.get('age'), 40)
    })
    
    it("manages dirty attributes", function() {
      assert.isFalse(model.isDirty())
      
      model.set('name', "bar")
      
      assert.ok(model.isDirty())
      assert.equal(model.getOriginal('name'), 'foo')
      assert.propertyVal(model.getDirty(), 'name', 'bar')
    })
    
  })

})