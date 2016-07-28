/* global it */
/* global describe */
/* global beforeEach */

var assert = require('chai').assert
var Model = require('../lib/model').default

describe("Test Model", function() {

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