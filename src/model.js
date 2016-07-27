
import EventEmitter from './events'
import _ from 'underscore'

/**
 * Data Model Class
 */
class Model {
  
  /**
   * Model constructor
   * 
   * @param {Object} data
   * @constructor
   */
  constructor(data) {
    this.data = {}
    this.original = {}
    
    // init model events
    this._events = new EventEmitter()
    this.registerEvents()
    
    // assign default attributes
    _.assign(this.data, _.result(this, 'defaults'))
    
    // fill model attributes
    this.fill(data)
  }
  
  /**
   * Model default attributes
   * 
   * @type {Object}
   */
  get defaults() {
    return {}
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
    for (let name in this.parse(data || {}) ) {
      this.set(name, data[name])
    }
    
    return this
  }
  
  /**
   * Set the value of an attribute
   * 
   * @param {String} attr
   * @param {Any} value
   * @return this model
   */
  set(attr, value) {
    if ( _.isObject(attr) ) return this.fill(attr)
    
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
    if (! attr ) return _.clone(this.data)
    
    var value = this.data[attr]
    
    return _.isUndefined(value) ? defaultValue : value
  }
  
  /**
   * Unset one or many attributes
   * 
   * @param {String|Array} attr
   * @param {Boolean} sync
   * @return this model
   */
  unset(attr, sync = false) {
    if (! _.isArray(attr) ) attr = [attr]
    
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
    return attr ? this.original[attr] : _.clone(this.original)
  }
  
  /**
   * Sync the original attributes state
   * 
   * @param {String|Array} attr
   * @return this model
   */
  syncOriginal(attr) {
    this.original = this.pick(attr || this.keys())
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
    
    return attr ? _.has(dirty, attr) : !_.isEmpty(dirty)
  }
  
  /**
   * Returns a JSON representation of this model
   * 
   * @return plain object
   */
  toJSON() {
    var json = {}
    
    return _.keys(this.data).forEach((attr) => {
      var value = this.get(attr)
      
      if (! _.isUndefined(value) ) json[attr] = value
    })
    
    return json
  }
  
  /**
   * Add a handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this model
   */
  on(event, fn) {
    this._events.on(...arguments)
    return this
  }
  
  /**
   * Add a one time handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this model
   */
  once(event, fn) {
    this._events.once(...arguments)
    return this
  }
  
  /**
   * Trigger an event with parameters
   * 
   * @param {String} event
   * @param {Array} args
   * @return promise
   */
  emit(event, ...args) {
    return this._events.emit(...arguments)
  }
  
  /**
   * Remove an event handler
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this model
   */
  off(event, fn) {
    this._events.off(...arguments)
    return this
  }
  
  /**
   * Override it to register the model events
   * 
   * @private
   */
  registerEvents() {
    // do nothing
  }
  
}

// underscore methods
['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'isEmpty', 'has']
.forEach(fn => {
  Model.prototype[fn] = function () { return _[fn](this.data, ...arguments) }
})

// exports
export default Model
