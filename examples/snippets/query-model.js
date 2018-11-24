const tang = require('../../lib')
const Joi = require('joi')

const QuerySchema = new tang.Schema(
  {
    model: { type: String, required: true },
    method: { type: String, default: 'find' },
    computed: Boolean,
    critiera: {},
    options: {},
    populate: Joi.array().items(Joi.lazy(() => QuerySchema.joi).description('Query schema')),
    withDefaults: Boolean,
    sort: String,
    offset: { type: Number, min: 0 },
    limit: { type: Number, min: 0 },
    one: Boolean,
    return: String,
    select: String,
    defaults: Boolean,
    id: Boolean,
    toModel: Boolean
  },
  { strict: true }
)

QuerySchema.computed.message = function() {
  return 'Hello, world!'
}

const Query = tang.model('Query', QuerySchema)

async function main() {
  let builder = tang.Builder
    .getInstance()
    .data({
      computed: true,
      id: true,
      foo: 'bar',
      populate: [ { model: 'User', foo: 'bar' } ]
    })
    .convertTo(Query)
    .toObject({
      computed: true
    })
  result = await builder.build()
  console.log(result)
}
main()
