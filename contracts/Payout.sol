pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) dividends;
    mapping(address => uint256) lastUpdated;

    /*
    * @dev 1/rate
    */
    uint256 private _rate;

    /*
    * @dev interval in seconds
    */
    uint256 private _interval;

    constructor(uint256 rate, uint256 interval) public {
        _rate = rate;
        _interval = interval;
    }

    function calculate(address owner, uint256 token) public {
        uint256 total;

        total = token.div(_interval).mul(now.sub(lastUpdated[owner]));

        lastUpdated[owner] = now;

        dividends[owner].add(total);
    }
}
