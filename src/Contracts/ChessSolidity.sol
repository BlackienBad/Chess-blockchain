pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ChessSolidity is ERC20{
    constructor () ERC20("Token", "TKN") {
        _mint(address(this), 1000000);
    }
    
    function faucet() public{
        this.transfer(msg.sender,1);
    }
}