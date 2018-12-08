pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Payout is Ownable {
    using SafeMath for uint256;

    event rateUpdate(bytes32 rate, uint newValue);
    event securityBalanceUpdate(address owner, uint amount);
    event dividendsCalculated(address owner, uint amount);
    event payoutsWithdrawn(address owner, uint amount);

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

    function calculate(address owner, uint256 token) public {
        uint256 total = securityBalance[owner].div(_interval).mul(now.sub(lastUpdated[owner]));

        updateSecurityBalance(owner, token);

        emit securityBalanceUpdate(owner, token);

        lastUpdated[owner] = now;

        dividendBalance[owner] = dividendBalance[owner].add(total);

        emit dividendsCalculated(owner, total);
    

    }

    function withdraw(address owner) public onlyOwner() {
        uint256 dividend = dividendBalance[owner];

        dividendBalance[owner] = 0;

        emit payoutsWithdrawn(owner, dividend);
    }
}
