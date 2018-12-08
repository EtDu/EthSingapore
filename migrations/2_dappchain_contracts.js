const payout = artifacts.require('./Payout.sol')

module.exports = function (deployer, network, accounts) {
    if (network === 'kovan') {
        return
    }

    deployer.then(async () => {
        await deployer.deploy(payout, 30)
        const payoutInstance = await payout.deployed()

        console.log('\n*************************************************************************\n')
        console.log(`Payout Contract Address: ${payoutInstance.address}`)
        console.log('\n*************************************************************************\n')
    })
}
