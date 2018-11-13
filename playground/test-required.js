// const Schema = require('../lib/Schema')
const parseRequiredPaths = require('../lib/helpers/getRequiredPaths')
require('colors')

let result = parseRequiredPaths({
  r0: String,
  r1: {
    type: String,
    required: true
  },
  r2: {
    type: String,
    required: 'create'
  },
  r3: {
    type: String,
    required: 'update'
  },
  r4: {
    r5: {
      type: String,
      required: true
    },
    r6: {
      type: String,
      required: 'create test1'
    },
    r7: {
      type: String,
      required: ['update', 'test2']
    }
  }
})
console.log(JSON.stringify(result.getScopes(), '', 3))
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
        // settings: {}
      }, {
        // required: 'update'
        scope: 'create'
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