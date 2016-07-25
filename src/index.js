
import _ = from 'underscore'

/**
 * 
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
    
    _.assign(this.data, _.result(this, 'defaults'))
    
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
   * Determine if an attribute exists on the model
   * 
   * @param {String} attr
   * @return boolean
   */
  has(attr) {
    return !!this.get(attr)
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
  
}

// underscore methods
['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'isEmpty'].forEach(fn => {
  Model.prototype[fn] = function () { return _[fn](this.data, ...arguments) }
})

// exports
export default Model
