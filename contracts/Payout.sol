pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event payoutsWithdrawn(address owner, uint256 amount);

    mapping(address => uint256) securityBalance;
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

    function calculate(address owner, uint256 token) public onlyOwner() {
        uint256 total = securityBalance[owner].div(_interval).mul(now.sub(lastUpdated[owner]));

        securityBalance[owner] = token;

        lastUpdated[owner] = now;

        dividends[owner].add(total);
    }

    function withdraw(address owner) public onlyOwner() {
        uint256 dividend = dividends[owner];

        dividends[owner] = 0;

        emit payoutsWithdrawn(owner, dividend);
    }
}
