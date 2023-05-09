import queries from './queries.js'

export default {
  install: (app, options = {}) => {
    Object.entries(queries).forEach(([key, value]) => app.provide(key, value))
  }
}