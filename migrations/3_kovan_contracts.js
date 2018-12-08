const securityCoin = artifacts.require('./SecurityCoin.sol')

module.exports = function (deployer, network, accounts) {
    if (network !== 'kovan') {
        return
    }

    deployer.then(async () => {
        await deployer.deploy(securityCoin, 1000000, 5, 'securityCoin', 'SC', 18)
        const securityCoinInstance = await securityCoin.deployed()

        console.log('\n*************************************************************************\n')
        console.log(`securityCoin Kovan Contract Address: ${securityCoinInstance.address}`)
        console.log('\n*************************************************************************\n')
    })

}
