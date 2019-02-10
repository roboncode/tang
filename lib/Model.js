const clone = require('./helpers/clone')
const definePrivateProperty = require('./helpers/definePrivateProperty')
const EventEmitter = require('events')
const jsonStringify = require('./helpers/jsonStringify')
// const Schema = require('./Schema')
const { merge } = require('lodash')

let eventMethods = ['emit', 'off', 'on', 'once']
let eventEmitter = new EventEmitter()

class Model {
  /**
   * @param { Object } input - the incoming data to validate
   */
  constructor(data, schema = {}, options = {}) {
    // if (!(schema instanceof Schema)) {
    //   schema = new Schema(schema)
    // }
    // keep origin data source
    definePrivateProperty(this, 'isModel', true)
    definePrivateProperty(this, '_dataSource', data)
    definePrivateProperty(this, '_schema', schema)
    definePrivateProperty(this, '_options', options)

    // set properties in instance
    Object.assign(this, data)

    // assign computed properties to prototype
    for (let key in schema.computed) {
      Object.defineProperty(this, key, {
        get: schema.computed[key]
      })
    }

    // assign schema methods
    for (let key in schema.methods) {
      definePrivateProperty(this, key, function() {
        return schema.methods[key].apply(this, arguments)
      })
    }

    // assign event methods
    for (let i = 0; i < eventMethods.length; i++) {
      let eventMethod = eventMethods[i]
      definePrivateProperty(this, eventMethod, function() {
        let args = [].slice.call(arguments)
        args[0] = this.constructor.name + ':' + args[0]
        eventEmitter[eventMethod].apply(eventEmitter, args)
      })
    }
  }

  getDataSource() {
    return this._dataSource
  }

  /**
   * Plain vanilla joi schema validation
   * @param { Object } input - the object to validate
   * @returns { Object } data - the validated data
   */
  async validate(options) {
    if (this._schema.validate) {
      let data = {}
      let customKeys = Object.keys(this)
      for (let i = 0; i < customKeys.length; i++) {
        let prop = customKeys[i]
        data[prop] = this[prop]
      }

      let opts = Object.assign({}, this._options.validation, options)
      const unknownProps = opts.unknownProps
      delete opts.unknownProps

      switch (unknownProps) {
        case 'allow':
          opts.stripUnknown = false
          opts.allowUnknown = true
          break
        case 'error':
          opts.stripUnknown = false
          opts.allowUnknown = false
          break
        case 'strip':
        default:
          opts.stripUnknown = true
          opts.allowUnknown = false
          break
      }

      opts.abortEarly = opts.abortEarly === true
      return await this._schema.validate(data, opts)
    }
  }

  /**
   * Return the pure json representation of the model
   * Note: this also allows for the model to be stringified
   *
   * @returns { Object } object - the pure data
   */
  async toObject(options = {}) {
    options = clone(options)

    const computed = options.computed
    delete options.computed

    let json
    if (options.skipValidation) {
      json = JSON.parse(jsonStringify(this))
      if (!options.noDefaults) {
        json = merge({}, this._schema.defaultValues, json)
      }
    } else {
      json = await this.validate(options)
    }

    if (computed) {
      let computedProps = Object.keys(this._schema.computed)
      for (let i = 0; i < computedProps.length; i++) {
        let prop = computedProps[i]
        json[prop] = this[prop]
      }
    }
    return json
  }
}

// setup static event methods
for (let i = 0; i < eventMethods.length; i++) {
  let eventMethod = eventMethods[i]
  Model[eventMethod] = function() {
    let args = [].slice.call(arguments)
    args[0] = this.name + ':' + args[0]
    eventEmitter[eventMethod].apply(eventEmitter, args)
  }
}

module.exports = Model
