pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event dividendsCalculated(address owner, uint256 amount, uint256 total);
    event payoutsWithdrawn(address owner, uint256 amount);

    mapping(address => mapping(address => uint256)) securityBalance;
    mapping(address => mapping(address => uint256)) lastUpdated;
    mapping(address => uint256) dividendBalance;

    // @dev 1/rate
    uint256 private _rate;

    // @dev interval in seconds
    uint256 private _interval;

    constructor(uint256 rate, uint256 interval) public {
        _rate = rate;
        _interval = interval;
    }

    function calculate(address owner, address securityCoinContract, uint256 amount) public onlyOwner() {
        uint256 secBal = securityBalance[owner][securityCoinContract];
        uint256 lasUp = lastUpdated[owner][securityCoinContract];

        uint256 dividend = secBal.div(_rate).mul((now.sub(lasUp)).div(_interval));

        securityBalance[owner][securityCoinContract] = amount;

        lastUpdated[owner][securityCoinContract] = now;

        dividendBalance[owner] = dividendBalance[owner].add(dividend);

        emit dividendsCalculated(owner, dividend, dividendBalance[owner]);
    }

    function withdraw(address owner) public onlyOwner() {
        require(dividendBalance[owner] > 0);

        uint256 dividend = dividendBalance[owner];

        dividendBalance[owner] = 0;

        emit payoutsWithdrawn(owner, dividend);
    }
}
