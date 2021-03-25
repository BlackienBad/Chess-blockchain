const ChessSolidity = artifacts.require('./ChessSolidity.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()


  contract('Token', (accounts) => {
    let token
    before(async () => {
        token = await ChessSolidity.deployed()
      })
    
    describe('deployment', async () => {
    it('deploys successfully', async () => {
        const address = token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })
    it('has a name', async () => {
        const name = await token.name()
        assert.equal(name, 'Token')
      })
  
      it('has a symbol', async () => {
        const symbol = await token.symbol()
        assert.equal(symbol, 'TKN')
      })
    })

    describe('token distribution', async () => {
        let result
    
        it('faucet', async () => {
          await token.faucet()
          result = await token.balanceOf(accounts[0])
          assert.equal(result.toString(), '1', 'the faucet worked')
      })
    })
  })