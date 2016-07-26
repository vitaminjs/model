
import EventEmitter from 'events'
import Promise from 'bluebird'

/**
 * Model Event Emitter Class
 */
class Events extends EventeEmitter {
  
  /**
   * Add a handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  on(event, fn) {
    event.split(' ').forEach(name => {
      if ( name ) this.super.on(name, fn)
    })
    
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
    event.split(' ').forEach(name => {
      if ( name ) this.super.once(name, fn)
    })
    
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
    return Promise.reduce(this.listeners(event), fn => {
      return fn(...args)
    })
  }
  
  /**
   * Remove an event handler
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  off(event, fn) {
    if ( fn ) this.removeListener(event, fn)
    else this.removeAllListeners(event)
    
    return this
  }
  
}

// exports
export default Events
