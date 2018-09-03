const Tang = require('./Tang')
const Builder = require('./Builder')
const EventDispatcher = require('./EventDispatcher')
const factory = require('./factory')
const Model = require('./Model')
const Schema = require('./Schema')
const helpers = require('./helpers')

let tang = new Tang()
tang.Builder = Builder
tang.EventDispatcher = EventDispatcher
tang.factory = factory
tang.Model = Model
tang.Schema = Schema
tang.helpers = helpers

module.exports = tang
