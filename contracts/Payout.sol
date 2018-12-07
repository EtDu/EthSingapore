pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event rateUpdate(bytes32 rate, uint256 newValue);

    mapping(address => uint256) dividends;
    mapping(address => uint256) lastUpdated;
    mapping(bytes32 => uint256) rates;


    constructor() public {

    }

    function updateRate(bytes32 rate, uint256 value) external onlyOwner() {
        rates[rate] = value;

        emit rateUpdate(rate, rates[rate]);
    }

    function calculate(address owner, uint256 token) public {
        uint256 total;
        uint256 rate = _calculateRate(token);

        //can utilise delegatecalls for different algorithms?
        total = rate.mul(now.sub(lastUpdated[owner]).div(30 seconds));

        lastUpdated[owner] = now;

        dividends.add(total);
    }

    function _calculateRate(uint256 token) internal returns (uint256 rate){

        //conditional parameters i.e. if token > 5 return rates['something']

        return 1;
    }

}
