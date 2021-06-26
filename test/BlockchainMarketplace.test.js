const { assert } = require('chai')

const BlockchainMarketplace = artifacts.require('./BlockchainMarketplace.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('BlockchainMarketplace', ([deployer, seller, buyer]) => {
  let blockchainmarketplace

  before(async () => {
    blockchainmarketplace = await BlockchainMarketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await blockchainmarketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await blockchainmarketplace.name()
      assert.equal(name, 'BlockchainMarketplace')
    })
  })

  describe('products', async () => {
    let result, productCount

    before(async () => {
      result = await blockchainmarketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), { from: seller })
      productCount = await blockchainmarketplace.productCount()
    })

    it('creates products', async () => {
      // SUCCESS
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE: Product must have a name
      await await blockchainmarketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      // FAILURE: Product must have a price
      await await blockchainmarketplace.createProduct('iPhone X', 0, { from: seller }).should.be.rejected;
    })


    //Test for product listing

    it('list products', async() => {

        const product = await blockchainmarketplace.products(productCount)
        assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(product.name, 'iPhone X', 'name is correct')
        assert.equal(product.price, '1000000000000000000', 'price is correct')
        assert.equal(product.owner, seller, 'owner is correct')
        assert.equal(product.purchased, false, 'purchased is correct')

    })

    // Test for selling product

    it('sells products', async() =>{

        // tracking the seller balance before purchased

        let oldSellerBalance

        oldSellerBalance= await web3.eth.getBalance(seller)
        oldSellerBalance= new web3.utils.BN(oldSellerBalance)



        //Success: buyer makes purchase

        result = await blockchainmarketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1','Ether')})

    // check logs

        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(event.name, 'iPhone X', 'name is correct')
        assert.equal(event.price, '1000000000000000000', 'price is correct')
        assert.equal(event.owner, buyer, 'owner is correct')
        assert.equal(event.purchased, true, 'purchased is correct')

      // checking that seller receives the fund


     // check that seller receive funds

        let newSellerBalance
        newSellerBalance = await web3.eth.getBalance(seller)
        newSellerBalance = new web3.utils.BN(newSellerBalance)

        let price
        price = web3.utils.toWei('1','Ether')
        price = new web3.utils.BN(price)


        const expectedBalance = oldSellerBalance.add(price)
        assert.equal(newSellerBalance.toString(), expectedBalance.toString())


        // failure check: 

        // 1. check Product must have valid id(buy product that does not exist)
        
        await blockchainmarketplace.purchaseProduct(101,{from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        //2. try to buy with not enough ether
        await blockchainmarketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;

        //3. deployer tries to buy product i.e. product cant be purchased twice
        await blockchainmarketplace.purchaseProduct(productCount,{from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        //4. buyer tries to buy again; buyer can't be the seller 
        await blockchainmarketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;



    })


  })
})











