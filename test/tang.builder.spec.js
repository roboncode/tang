const expect = require('chai').expect
const Builder = require('../lib/Builder')

class Model {
  constructor(data) {
    this.data = data
  }

  toObject() {
    return this.data
  }
}

class Bogus {}

describe('tang builder', function() {
  describe('create two "default" singletons', function() {
    let builder1 = Builder.getInstance()
    let builder2 = Builder.getInstance()
    it('builders to be the same', function() {
      expect(builder1).to.equal(builder2)
    })
  })

  describe('create two different singletons', function() {
    let builder1 = Builder.getInstance()
    let builder2 = Builder.getInstance('')
    it('builders to be the same', function() {
      expect(builder1).to.not.equal(builder2)
    })
  })

  describe('intercept', function() {
    it('should call intercept', async function() {
      let builder = Builder.getInstance()
      builder.data({ name: 'John Smith' })
      let result = await builder.build()
      expect(result).to.deep.equal({ name: 'John Smith' })
    })
  })

  describe('convertTo', function() {
    it('should convert data to Model', async function() {
      let builder = Builder.getInstance()
      builder.data({ name: 'John Smith' })
      builder.convertTo(Model)
      let result = await builder.build()
      expect(result).to.instanceof(Model)
    })
  })

  describe('convertTo with array of items', function() {
    it('should convert data to Model', async function() {
      let builder = Builder.getInstance()
      builder.data([{ name: 'John Smith' }])
      builder.convertTo(Model)
      let result = await builder.build()
      expect(result[0]).to.instanceof(Model)
    })
  })

  describe('toObject with Bogus model', function() {
    it('should throw an error', async function() {
      let result
      try {
        let builder = Builder.getInstance()
          .data({ name: 'John Smith' })
          .convertTo(Bogus)
          .toObject()
        await builder.build()
      } catch (e) {
        result = e
      }
      expect(result).to.be.an('error')
    })
  })

  describe('inspect', function() {
    it("should inspect data's current state", async function() {
      let builder = Builder.getInstance()
      builder
        .data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .inspect()
      let result = await builder.build()
      expect(result).to.deep.equal({ name: 'John Smith' })
    })
  })

  describe('inspect', function() {
    it("should inspect data's current state", async function() {
      let builder = Builder.getInstance()
      let inspectCalled = false
      builder.addMethod('inspect', function(
        target,
        index,
        items,
        note = 'Inspect'
      ) {
        inspectCalled = true
        return target
      })
      builder
        .data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .inspect()
      await builder.build()
      expect(inspectCalled).to.be.true
    })
  })

  describe('intercept', function() {
    it('should call intercept', async function() {
      let builder = Builder.getInstance()
      let interceptCalled = false
      builder
        .data({ name: 'John Smith' })
        .convertTo(Model)
        .toObject()
        .intercept(function(item) {
          interceptCalled = true
          return item
        })
      await builder.build()
      expect(interceptCalled).to.be.true
    })
  })
})
