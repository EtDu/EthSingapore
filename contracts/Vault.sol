pragma solidity ^0.4.24;

import "./IERC20.sol";
import "./Ownable.sol";

contract Vault is Ownable {
    IERC20 private _token;

    constructor() public {
        setTokenAddress(0xC4375B7De8af5a38a93548eb8453a498222C4fF2);
    }

    function getTokenAddress() public view returns (address token){
        return _token;
    }

    function setTokenAddress(address tokenContract) public onlyOwner() {

        require(tokenContract != address(0), "Invalid token contract address.");

        uint32 size;

        assembly {
            size := extcodesize(tokenContract)
        }

        require(size > 0, "Address is not a contract.");

        _token = IERC20(tokenContract);
    }

    function transfer(address to, uint256 value) external onlyOwner() {
        _token.transfer(to, value);
    }

    function balanceOf(address who) public view returns (uint256){
        return _token.balanceOf(who);
    }
}