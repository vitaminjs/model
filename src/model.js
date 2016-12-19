
import {
  has, extend, assign, result, clone, values, omit, pick,
  isUndefined, isArray, isObject, isEmpty, pairs, invert
} from 'underscore'

/**
 * Data Model Class
 */
class Model {
  
  /**
   * Model constructor
   * 
   * @param {Object} data
   * @param {Boolean} exists
   * @constructor
   */
  constructor(data = {}, exists = false) {
    this.data = {}
    this.original = {}
    this.exists = exists
    
    // assign default attributes
    assign(this.data, result(this, 'defaults'))
    
    // fill the model attributes
    if (! exists ) this.fill(data)
    else this.setData(data, true)
  }
  
  /**
   * Inheritance helper
   * 
   * @param {Object} props
   * @param {Object} statics
   * @return constructor function
   */
  static extend(props = {}, statics = {}) {
    var parent = this
    var child = function () { parent.apply(this, arguments) }
    
    // use custom constructor
    if ( has(props, 'constructor') ) child = props.constructor
    
    // set the prototype chain to inherit from `parent`
    child.prototype = Object.create(parent.prototype, {
      constructor: { value: child, writable: true, configurable: true }
    })
    
    // add static and instance properties
    extend(child, statics)
    extend(child.prototype, props)
    
    // fix extending static properties
    Object.setPrototypeOf ? Object.setPrototypeOf(child, parent) : child.__proto__ = parent
    
    return child
  }
  
  /**
   * A factory helper to instanciate models without using `new`
   * 
   * @param {Object} data
   * @param {Boolean} exists
   * @return model instance
   */
  static make(data = {}, exists = false) {
    return new this(...arguments)
  }
  
  /**
   * Parse attributes values
   * 
   * @param {Object} data
   * @return plain object
   */
  parse(data) {
    return data
  }
  
  /**
   * Fill the model data
   * 
   * @param {Object} data
   * @return this model
   */
  fill(data) {
    for ( let name in this.parse(data) ) {
      this.set(name, data[name])
    }
    
    return this
  }
  
  /**
   * Set the ID value
   * 
   * @param {Any} id
   * @return this model
   */
  setId(id) {
    return this.set(this.idAttribute, id)
  }
  
  /**
   * Get the ID value
   * 
   * @return any
   */
  getId() {
    return this.get(this.idAttribute)
  }
  
  /**
   * Set the value of an attribute
   * 
   * @param {String} attr
   * @param {Any} value
   * @return this model
   */
  set(attr, value) {
    if ( isObject(attr) ) return this.fill(attr)
    
    if ( attr ) this.data[attr] = value
    
    return this
  }
  
  /**
   * Get the value of an attribute
   * 
   * @param {String} attr
   * @param {Any} defaultValue
   * @return any
   */
  get(attr, defaultValue) {
    if (! attr ) return clone(this.data)
    
    var value = this.data[attr]
    
    return isUndefined(value) ? defaultValue : value
  }
  
  /**
   * Set the model raw data
   * 
   * @param {Object} data
   * @param {Boolean} sync
   * @return this model
   */
  setData(data, sync = true) {
    assign(this.data, data)
    
    // sync original attributes with the current state
    if ( sync === true ) this.syncOriginal()
    
    return this
  }
  
  /**
   * Get the model raw data
   * 
   * @return plain object
   */
  getData() {
    return clone(this.data)
  }
  
  /**
   * Unset one or many attributes
   * 
   * @param {String|Array} attr
   * @param {Boolean} sync
   * @return this model
   */
  unset(attr, sync = false) {
    if (! isArray(attr) ) attr = [attr]
    
    attr.forEach(key => { this.data[key] = undefined })
    
    if ( sync === true ) this.syncOriginal(attr)
    
    return this
  }
  
  /**
   * Clear all attributes on the model
   * 
   * @apram {Boolean} sync
   * @return this model
   */
  clear(sync = false) {
    return this.unset(this.keys(), sync)
  }
  
  /**
   * Get the original value of dirty attributes
   * 
   * @param {String} attr
   * @return any
   */
  getOriginal(attr = null) {
    return attr ? this.original[attr] : clone(this.original)
  }
  
  /**
   * Sync the original attributes state
   * 
   * @param {String|Array} attr
   * @return this model
   */
  syncOriginal(attr) {
    if ( isEmpty(attr) ) this.original = clone(this.data)
    else extend(this.original, this.pick(attr))
    
    return this
  }
  
  /**
   * Return a hash of dirty attributes
   * 
   * @return plain object
   */
  getDirty() {
    return this.pick((value, attr) => value !== this.getOriginal(attr))
  }
  
  /**
   * Determine if the model or given attribute have been modified
   * 
   * @param {String} attr
   * @return boolean
   */
  isDirty(attr = null) {
    var dirty = this.getDirty()
    
    return attr ? has(dirty, attr) : !isEmpty(dirty)
  }
  
  /**
   * Returns a JSON representation of this model
   * 
   * @return plain object
   */
  toJSON() {
    var json = {}
    
    Object.keys(this.data).forEach((attr) => {
      var value = this.get(attr)
      
      // do not append undefined attributes
      if (! isUndefined(value) ) json[attr] = value
    })
    
    return json
  }
  
  /**
   * Get all the names of this model attributes
   * 
   * @return array
   */
  keys() {
    return Object.keys(this.data)
  }
  
  /**
   * Get all the values of this model attributes
   * 
   * @return array
   */
  values() {
    return values(this.data)
  }
  
  /**
   * Convert this model attributes into `[key, value]` pairs
   * 
   * @return array
   */
  pairs() {
    return pairs(this.data)
  }
  
  /**
   * Return a copy of model's data, where the attributes become the values and vis versa
   * 
   * @return plain object
   */
  invert() {
    return invert(this.data)
  }
  
  /**
   * Get a copy of the model's data filtered to have only whitelisted attributes
   * 
   * @return plain object
   */
  pick(...attrs) {
    return pick(this.data, ...attrs)
  }
  
  /**
   * Get a copy of the model's data filtered to omit the blacklisted attributes
   * 
   * @return plain object
   */
  omit(...attrs) {
    return omit(this.data, ...attrs)
  }
  
  /**
   * Determine if this model contains no values
   * 
   * @return boolean
   */
  isEmpty() {
    return isEmpty(this.data)
  }
  
  /**
   * Determine if this model contain the given attribute name
   * 
   * @return boolean
   */
  has(attr) {
    return has(this.data, attr)
  }
  
}

/**
 * Define the primary key name
 * 
 * @type {String}
 */
Object.defineProperty(Model.prototype, 'idAttribute', {
  value: 'id',
  writable: true,
  configurable: true
})

/**
 * Define the model default attributes
 * 
 * @type {Object}
 */
Object.defineProperty(Model.prototype, 'defaults', {
  value: {},
  writable: true,
  configurable: true
})

// exports
export default Model
