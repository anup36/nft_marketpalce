pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20{
    constructor() ERC20("USD Tether", "USDT"){
        _mint(msg.sender, 10000000000000000000000000000000000000000);
    }
};


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20{
    constructor() ERC20("USD Coin", "USDC"){
        _mint(msg.sender, 10000000000000000000000000000000000000000);
    }
};


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ChainLink is ERC20{
    constructor() ERC20("Link Token", "LINK"){
        _mint(msg.sender, 10000000000000000000000000000000000000000);
    }
};