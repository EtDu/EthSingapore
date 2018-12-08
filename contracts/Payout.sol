pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event dividendsCalculated(address owner, uint256 amount, uint256 total);
    event payoutsWithdrawn(address owner, uint256 amount);

    mapping(address => mapping(address => uint256)) private _securityBalance;
    mapping(address => mapping(address => uint256)) private _lastUpdated;
    mapping(address => uint256) private _dividendBalance;

    // @dev 1/rate
    uint256 private _rate;

    // @dev interval in seconds
    uint256 private _interval;

    constructor(uint256 rate, uint256 interval) public {
        _rate = rate;
        _interval = interval;
    }

    function getRate() public view returns (uint256){
        return _rate;
    }

    function getInterval() public view returns (uint256){
        return _interval;
    }

    function getDividends(address divOwner) public view returns (uint256) {
        return _dividendBalance[divOwner];
    }

    function calculate(address owner, address securityCoinContract, uint256 amount) public onlyOwner() {
        uint256 secBal = _securityBalance[owner][securityCoinContract];
        uint256 lasUp = _lastUpdated[owner][securityCoinContract];

        uint256 dividend = secBal.div(_rate).mul((now.sub(lasUp)).div(_interval));

        _securityBalance[owner][securityCoinContract] = amount;

        _lastUpdated[owner][securityCoinContract] = now;

        _dividendBalance[owner] = _dividendBalance[owner].add(dividend);

        emit dividendsCalculated(owner, dividend, _dividendBalance[owner]);
    }

    function withdraw(address owner) public onlyOwner() {
        require(_dividendBalance[owner] > 0);

        uint256 dividend = _dividendBalance[owner];

        _dividendBalance[owner] = 0;

        emit payoutsWithdrawn(owner, dividend);
    }
}
