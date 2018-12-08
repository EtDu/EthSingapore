pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event rateUpdate(bytes32 rate, uint256 newValue);
    event securityBalanceUpdate(address owner, uint amount);

    mapping(address => uint256) securityBalance;
    mapping(address => uint256) dividendBalance;
    mapping(address => uint256) lastUpdated;
    mapping(bytes32 => uint256) rates;

    /*
    * @dev interval in seconds
    */
    uint256 private _interval;

    constructor(uint256 interval) public {
        _interval = interval;
    }

    function updateRate(bytes32 rate, uint256 value) external onlyOwner() {
        rates[rate] = value;

        emit rateUpdate(rate, rates[rate]);
    }

    function updateSecurityBalance(address owner, uint amount) private {
        securityBalance[owner] = securityBalance[owner].add(amount);

        emit securityBalanceUpdate(owner, amount);
    }

    function calculate(address owner, uint256 token) public onlyOwner {
        uint256 total;
        // uint256 rate = _calculateRate(token);

        total = securityBalance[owner].div(_interval).mul(now.sub(lastUpdated[owner]));

        updateSecurityBalance(owner, token);

        lastUpdated[owner] = now;

        dividendBalance[owner] = dividendBalance[owner].add(total);


    }

    // function _calculateRate(uint256 token) internal returns (uint256 rate){

    //     //conditional parameters i.e. if token > 5 return rates['something']

    //     return 1;
    // }

}
