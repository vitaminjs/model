
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
    
    this.fill(data)
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
  unset(attr, sync) {
    if (! _.isArray(attr) ) attr = [attr]
    
    attr.forEach(key => this.data[key] = undefined)
    
    if ( sync === true ) this.syncOriginal()
    
    return this
  }
  
  /**
   * Get the original value of dirty attributes
   * 
   * @param {String} attr
   * @return any
   */
  getOriginal(attr) {
    return attr ? this.original[attr] : _.clone(this.original)
  }
  
  /**
   * Sync the original attributes with the current ones
   */
  syncOriginal() {
    this.original = _.clone(this.data)
  }
  
  /**
   * Return a hash of dirty attributes
   * 
   * @return plain object
   */
  getDirty() {
    return _.pick(this.data, (val, attr) => val !== this.getOriginal(attr))
  }
  
  /**
   * Determine if the model or given attribute have been modified
   * 
   * @param {String} attr
   * @return boolean
   */
  isDirty(attr) {
    var dirty = this.getDirty()

    return attr ? _.has(dirty, attr) : !_.isEmpty(dirty)
  }
  
  /**
   * Pick specific attributes
   * 
   * @param {Array} attrs
   * @return plain object
   */
  pick(...attrs) {
    return _.pick(this.data, ...attrs)
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

// exports
module.exports = Model
