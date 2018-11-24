const { Model, Schema } = require('../lib')
const Joi = require('joi')

async function main() {
  let result

  // const UserSchema = new Schema({
  //   name: String,
  //   access_token: { type: [ String, Number ] },
  //   list: [ String, Number ]
  // })

  // const schema = Joi.object()
  //   .keys({
  //     username: Joi.string().alphanum().min(3).max(30).required(),
  //     password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  //     access_token: [ Joi.string(), Joi.number() ],
  //     birthyear: Joi.number().integer().min(1900).max(2013),
  //     email: Joi.string().email({ minDomainAtoms: 2 })
  //   })
  //   .with('username', 'birthyear')
  //   .without('password', 'access_token')

  const schema = {
    username: { type: String, alphanum: true, min: 3, max: 30, required: true },
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: { type: [ String, Number ] },
    birthyear: { type: Number, integer: true, min: 1900, max: 2018 },
    email: Joi.string().email({ minDomainAtoms: 2 })
  }
  
  const UserSchema = new Schema(schema)
  UserSchema.joi = UserSchema.joi
    .with('username', 'birthyear')
    .without('password', 'access_token')
  // const User = new Model({ name: 'Rob', bogus: true }, UserSchema)
  // const User = new Model({ name: 'Rob', access_token: 'abc', list: [ 'abc', 123] }, UserSchema)
  const User = new Model(
    { username: 'roboncode', birthyear: 1972, password: 'secret', access_token: 'abc123' },
    UserSchema
  )
  // const User = new Model({ }, UserSchema)
  // const User = new Model(null, UserSchema)
  try {
    result = await User.validate()
  } catch (e) {
    result = e
  }
  console.log(result)
}

main()
