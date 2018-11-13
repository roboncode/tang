  function getKey(key, prefix = '') {
    return (prefix ? prefix + '.' : '') + key
  }

  function parsePath(list = [], path) {
    let props = path.split('.')
    let paths = []
    for (let prop of props) {
      paths.push(prop)
      if (list.indexOf(prop) === -1) {
        list.push(paths.join('.'))
      }
    }
    return list
  }

  class RequiredKeys {
    constructor(data) {
      this.all = []
      // this.create = []
      // this.update = []
      this.getKeys(data)
    }

    getKeys(data, keys = [], prefix = '') {
      for (let key in data) {
        if (typeof data[key] === 'object') {
          let k = this.getKeys(data[key], [], getKey(key, prefix))
          if (data[key] instanceof Array && data[key].length) {
            keys = keys.concat(key + '[].' + k[0].substr(2))
          } else {
            keys = keys.concat(k)
          }
        } else if (key === 'required') {
          this.all = parsePath(this.all, prefix)
          if(data[key] !== true) {
            let prop = data[key]
            this[prop] = parsePath(this[prop], prefix)
          }
          delete data[key]
        }
      }
      return this
    }
  }

  module.exports = (data) => {
    return new RequiredKeys(data)
  }