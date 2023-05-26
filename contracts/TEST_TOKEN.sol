// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";


contract TEST_TOKEN is IERC20 {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    address public owner;

    address factoryContract;

    mapping(address => bool) public isStaff;

    constructor(string memory _name, string memory _symbol, address _factoryContract){
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        isStaff[msg.sender] = true;
        factoryContract = _factoryContract;
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external onlyStaff {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function addStaff(address _staff) external onlyStaff {
        isStaff[_staff] = true;
    }
    modifier onlyStaff(){
        require(isStaff[msg.sender] || msg.sender == factoryContract, "Only staff can call this function");
        _;
    }
}
