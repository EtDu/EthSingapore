pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event rateUpdate(bytes32 rate, uint newValue);
    event securityBalanceUpdate(address owner, uint amount);
    event dividendsCalculated(address owner, uint amount);
    event payoutsWithdrawn(address owner, uint amount);

    mapping(address => mapping(address => uint256)) securityBalance;
    mapping(address => mapping(address => uint256)) lastUpdated;
    mapping(address => uint256) dividends;

    /*
    * @dev 1/rate
    */
    uint256 private _rate;

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

    function calculate(address owner, address securityCoin, uint256 token) public onlyOwner() {
        uint256 total = securityBalance[owner][securityCoin].div(_interval).mul(now.sub(lastUpdated[owner][securityCoin]));

        securityBalance[owner][securityCoin] = token;

        lastUpdated[owner][securityCoin] = now;

        dividendBalance[owner] = dividendBalance[owner].add(total);

        emit dividendsCalculated(owner, total);
    

    }

    function withdraw(address owner) public onlyOwner() {
        uint256 dividend = dividendBalance[owner];

        dividendBalance[owner] = 0;

        emit payoutsWithdrawn(owner, dividend);
    }
}
