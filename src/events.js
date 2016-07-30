
import EventEmitter from 'events'
import Promise from 'bluebird'

/**
 * Model Event Emitter Class
 */
class ModelEvents extends EventEmitter {
  
  /**
   * Add a handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  on(event, fn) {
    event.split(' ').forEach(name => { name && super.on(name, fn) })
    return this
  }
  
  /**
   * Add a one time handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  once(event, fn) {
    event.split(' ').forEach(name => { name && super.once(name, fn) })
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
    return Promise.map(this.listeners(event), fn => fn(...args))
  }
  
  /**
   * Remove an event handler
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  off(event, fn) {
    if ( fn ) this.removeListener(...arguments)
    else this.removeAllListeners(...arguments)
    
    return this
  }
  
}

// exports
export default ModelEvents
