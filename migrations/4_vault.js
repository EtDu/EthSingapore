const Vault = artifacts.require("./Vault.sol");

module.exports = function (deployer, network) {
    if (network !== 'kovan') {
        return
    }
    deployer.deploy(Vault);
    deployer.then(async () => {
        await deployer.deploy(Vault)
        const vaultInstance = await Vault.deployed()

        console.log('\n*************************************************************************\n')
        console.log(`securityCoin Kovan Contract Address: ${vaultInstance.address}`)
        console.log('\n*************************************************************************\n')
    })
};
