import Toast from './Toast.vue'
import service from './service.js'

Toast.install = (app, options = {}) => {
  const plugin = service(options)
  
  app.provide('toast', plugin)
}

export default Toast
export { Toast, service }