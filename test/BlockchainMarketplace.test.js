const BlockchainMarketplace = artifacts.require("./BlockchainMarketplace.sol")

contract('BlockchainMarketplace',(accounts)=> {
    let blockchainmarketplace 
    
    before(async() => {
        blockchainmarketplace = await BlockchainMarketplace.deployed()
    })

    
    describe('deployment', async () => {

        it('deploys successfully'), async() => {
        const address = await blockchainmarketplace.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)

        }

        it('has a name', async () => {
            const name = await blockchainmarketplace.name()
            assert.equal(name, 'BlockchainMarketplace')

        })

    })

})





describe('products', async () => {

    let result, productCount, blockchainmarketplace
   
    before(async() => {
        result = await blockchainmarketplace.createProduct('Macbook pro', web3.utils.toWei('1', 'Ether') )  // price in wei
        productCount = await blockchainmarketplace.productCount()
    })

 
    it('create products', async () => {

        assert.equal(productCount, 1)

        console.log(result.logs)

    })

})











