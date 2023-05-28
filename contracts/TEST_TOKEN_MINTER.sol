// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";


contract NEKO_TEST_TOKEN_MINTER {

    address owner;
    mapping(address => bool) public isStaff;
    address[] public tokenContractsArray;

    constructor(){
        owner = msg.sender;
        isStaff[msg.sender] = true;
    }

    function addTokens(address[] memory _tokenContractsArray) public {
        require(isStaff[msg.sender], "Only staff can add tokens");
        require(_tokenContractsArray.length == 8, "Must add 8 tokens");
        tokenContractsArray = _tokenContractsArray;
    }

    function mintTester() public {
        
    IERC20(tokenContractsArray[0]).mint(10000 ether); // MATIC
    IERC20(tokenContractsArray[1]).mint(5 ether); // WETH
    IERC20(tokenContractsArray[2]).mint(10000 ether); // USDC
    IERC20(tokenContractsArray[3]).mint(0.5 ether); // WBTC

    IERC20(tokenContractsArray[0]).transfer(msg.sender, 10000 ether); // MATIC
    IERC20(tokenContractsArray[1]).transfer(msg.sender, 5 ether); // WETH
    IERC20(tokenContractsArray[2]).transfer(msg.sender, 10000 ether); // USDC
    IERC20(tokenContractsArray[3]).transfer(msg.sender, 0.5 ether); // WBTC


    // IERC20(tokenContractsArray[4]).mint(10000 ether); // aMATIC
    // IERC20(tokenContractsArray[5]).mint(5 ether); // aWETH
    // IERC20(tokenContractsArray[6]).mint(10000 ether); // aUSDC
    // IERC20(tokenContractsArray[7]).mint(0.5 ether); // aWBTC

    // IERC20(tokenContractsArray[4]).mint(10000 ether); // MaticX
    // IERC20(tokenContractsArray[5]).mint(10000 ether); // USDT
    // IERC20(tokenContractsArray[6]).mint(10000 ether); // DAI
    // IERC20(tokenContractsArray[7]).mint(5 ether); //wstETH
    // IERC20(tokenContractsArray[8]).mint(10000 ether); // GHST
    // IERC20(tokenContractsArray[9]).mint(1600 ether); // LINK
    // IERC20(tokenContractsArray[10]).mint(2000 ether); // BAL
    // IERC20(tokenContractsArray[11]).mint(10000 ether); // EURS
    // IERC20(tokenContractsArray[12]).mint(10000 ether); // CRV
    // IERC20(tokenContractsArray[13]).mint(10000 ether); // agEUR
    // IERC20(tokenContractsArray[14]).mint(10000 ether); // miMATIc
    // IERC20(tokenContractsArray[15]).mint(10000 ether); // SUSHI
    // IERC20(tokenContractsArray[16]).mint(151 ether); // DPI


    }

}
