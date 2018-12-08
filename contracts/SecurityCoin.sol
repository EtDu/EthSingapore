pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./ERC20.sol";

/*
* @dev
*/

contract SecurityCoinFactory {
    event NewSecurityCoin(address indexed newCoinAdress, uint256 totalSupply, uint256 initialRate, string name, string symbol, uint8 decimals);
    event TriggerWithdraw(address owner);

    address[] public tokens;

    function newSecurityCoin(address owner, uint256 totalSupply, uint256 initialRate, string name, string symbol, uint8 decimals) public returns (address)
    {
        address newCoinAddress = new SecurityCoin(owner, totalSupply, initialRate, name, symbol, decimals);

        tokens.push(newCoinAddress);

        return newCoinAddress;

        emit NewSecurityCoin(newCoinAddress, totalSupply, initialRate, name, symbol, decimals);
    }

    function getTokenAddress(uint256 index) public view returns (address) {
        return tokens[index];
    }
}

contract SecurityCoin is Ownable, ERC20 {

    event securityPurchase(address purchaser, uint256 received);
    event rateUpdate(uint256 rate);

    /*
    * @dev 1 ETH : [_rate] tokens
    */
    uint256 private _rate;

    constructor  (address newOwner, uint256 totalSupply, uint256 initialRate, string name, string symbol, uint8 decimals) public ERC20(newOwner, totalSupply, name, symbol, decimals) {
        transferOwnership(newOwner);
        _rate = initialRate;
    }

    function currentRate() public view returns (uint256) {
        return _rate;
    }

    function purchaseSecurity() public payable {
        uint256 token;

        token = msg.value.mul(_rate);
        _transfer(owner(), msg.sender, token);

        emit securityPurchase(msg.sender, balanceOf(msg.sender));
    }

    function updateRate(uint256 newRate) external onlyOwner() {
        _rate = newRate;

        emit rateUpdate(_rate);
    }

    function triggerWithdraw() public {
        emit TriggerWithdraw(msg.sender);
    }
}
