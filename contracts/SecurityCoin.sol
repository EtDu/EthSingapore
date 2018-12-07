pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./ERC20.sol";

/*
* @dev
*/
contract SecurityCoin is Ownable, ERC20 {
    event securityPurchase(address purchaser, uint256 received);
    event rateUpdate(uint256 rate);

    /*
    * @dev 1 ETH : [_rate] tokens
    */
    uint256 private _rate;

    constructor  (uint256 totalSupply, uint256 initialRate, string name, string symbol, uint8 decimals) public ERC20(totalSupply, name, symbol, decimals) {
        _rate = initialRate;
    }

    function currentRate() public view returns (uint256) {
        return _rate;
    }

    function purchaseSecurity() public payable {
        uint256 token;

        token = msg.value.mul(_rate).div(1e18);
        _transfer(owner(), msg.sender, token);

        emit securityPurchase(msg.sender, token);
    }

    function updateRate(uint256 newRate) external onlyOwner() {
        _rate = newRate;

        emit rateUpdate(_rate);
    }
}
