const asyncForEach = require('./helpers/asyncForEach')
const microtime = require('microtime')
const snooze = require('./helpers/snooze')
const padding = 35
require('colors')

class Builder {
  static getInstance(name = 'default') {
    if (!this._instances) {
      this._instances = {}
    }
    if (!this._instances[name]) {
      this._instances[name] = new this()
    }
    return this._instances[name]
  }

  constructor() {
    this.methods = {}

    this.addMethod('convertTo', function(data, index, items, Model) {
      if (Model === data.constructor) {
        return data
      }
      return new Model(data)
    })

    this.addMethod('toObject', function(model, index, items, options) {
      if (model.toObject) {
        return model.toObject(options)
      }
      throw new Error('toObject() requires first element to be of type Model')
    })

    this.addMethod('inspect', function(target, index, items, note = 'Inspect') {
      console.log(note, `[${index}] =>`, target)
      return target
    })

    this.addMethod('intercept', function(target, index, items, callback) {
      return callback(target, index || 0)
    })
  }

  data(data) {
    this.isArray = data instanceof Array
    this.items = [].concat(data)
    this.queue = []
    return this
  }

  addMethod(name, method) {
    this[name] = function() {
      let args = [].slice.call(arguments)
      this.queue.push({
        method,
        args
      })
      return this
    }
  }

  async build() {
    let items = this.items
    let validItems = []
    let returnItem = await asyncForEach(items, async (item, index) => {
      if (this.queue.length) {
        let result = await asyncForEach(this.queue, async message => {
          let args = [].concat(item, index, [items], message.args)
          // force releasing of the thread
          await snooze()
          item = await message.method.apply(this, args)
          return item
        })
        if (result instanceof Error) {
          return result
        }
        validItems.push(result)
      }
      return item
    })
    if(returnItem instanceof Error) {
      return Promise.reject(returnItem)
    }

    if (this.isArray) {
      return validItems
    }
    return returnItem
  }
}

module.exports = Builder
