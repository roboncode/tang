const Schema = require('./lib/Schema')
const getRequireKeys = require('./lib/helpers/getRequiredPaths')
require('colors')

let result = getRequireKeys({
  name: {
    type: String
  },
  settings: {
    active: {
      type: Boolean,
      required: true
    },
    locale: {
      type: String,
      default: 'en-US',
      required: 'create|test'
    },
    a: {
      b: {
        c: {
          d: {
            required: 'update'
          },
          e: String
        }
      }
    }
  }
})
console.log(result)

return

let schema = new Schema({
  name: {
    type: String,
    required: 'create'
  },
  settings: {
    active: {
      type: Boolean,
      // default: false,
      required: 'update'
    },
    // locale: {
    //   type: String,
    //   default: 'en-US',
    //   require: true
    // }
  }
})

async function main() {
  try {
    let result = await schema
      // .requiredKeys('name', 'settings.active')
      .validate({
        // name: 'rob',
        settings: {}
      }, {
        required: 'update'
      })
    console.log('result #1'.green, result)
  } catch (e) {
    console.log('whoops #1'.red, e.message)
  }

  // try {
  //   let result = await schema
  //     .validate({
  //       name: 'rob',
  //       settings: {}
  //     })
  //   console.log('result #2'.green, result)
  // } catch (e) {
  //   console.log('whoops #2'.red, e.message)
  // }
}

main()