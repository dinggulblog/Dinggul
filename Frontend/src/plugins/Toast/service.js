import Toast from './Toast.vue'
import Events from './events.js'
import elements from './elements.js'

const service = (globalOptions = {}) => {
  return {
    show(message, options = {}) {
      return elements.mountElement(Toast, {
        props: { ...globalOptions, ...{ message, ...options } },
      })
    },

    open(type, message, options = {}) {
      options.type = type
      this.clear()
      return this.show(message, options)
    },

    success(message, options = {}) {
      options.type = 'success'
      return this.show(message, options)
    },

    error(message, options = {}) {
      options.type = 'error'
      return this.show(message, options)
    },

    warn(message, options = {}) {
      options.type = 'warn'
      return this.show(message, options)
    },

    clear() {
      Events.$emit('toast-clear')
    }
  }
}

export default service