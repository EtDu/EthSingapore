const securityCoin = artifacts.require('SecurityCoinFactory')

module.exports = function (deployer, network, accounts) {
    if (network !== 'kovan') {
        return
    }

    deployer.then(async () => {
        await deployer.deploy(securityCoin)
        const securityCoinInstance = await securityCoin.deployed()

        console.log('\n*************************************************************************\n')
        console.log(`securityCoin Kovan Contract Address: ${securityCoinInstance.address}`)
        console.log('\n*************************************************************************\n')
    })

}
