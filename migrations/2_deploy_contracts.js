var Ownable = artifacts.require('./Ownable.sol');
var ERC20Detailed = artifacts.require('./ERC20Detailed.sol');
var ERC20 = artifacts.require('./ERC20.sol');
var SecurityCoin = artifacts.require('./SecurityCoin.sol');

module.exports = function (deployer) {
    deployer.deploy(ERC20Detailed);
    deployer.link(ERC20, ERC20Detailed);
    deployer.deploy(ERC20);
    deployer.deploy(Ownable);
    deployer.link(SecurityCoin, ERC20);
    deployer.link(SecurityCoin, Ownable);
    deployer.deploy(SecurityCoin);
};
