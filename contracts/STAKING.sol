// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ILIDO.sol";
import "./interfaces/IAAVEPool.sol";



contract NEKOStaking {

    mapping(address => bool) isAAVEUnderlying;
    mapping(address => bool) isAAVEToken;
    address immutable AAVEPoolAddress;
    mapping(address => mapping(address => uint256)) userBalances;

    address immutable foundationAddress;
    address[] allTokens;

     constructor(address[] memory _aaveUnderlying, address[] memory _aaveTokens, address _AAVEPoolAddress, address _foundationAddress) {
         for(uint8 i; i < _aaveUnderlying.length; i++){
             isAAVEUnderlying[_aaveUnderlying[i]] = true;
             allTokens.push(_aaveUnderlying[i]);
         }
         for(uint8 i; i < _aaveTokens.length; i++){
             isAAVEToken[_aaveTokens[i]] = true;
             allTokens.push(_aaveUnderlying[i]);
         }
         AAVEPoolAddress = _AAVEPoolAddress;
         foundationAddress = _foundationAddress;
     }

    //stake
    //if aave underlying, then deposit into aave then hold aToken
    //if aave aToken, then hold

    function stake(address _token, uint256 _amount) public {
        require(isAAVEUnderlying[_token] || isAAVEToken[_token], "Not an approved token to stake on NEKO.");

        //Handle AAVEUnderlying
        if(isAAVEUnderlying[_token]){
            require( IERC20(_token).transferFrom(msg.sender, address(this), _amount),"transferring AAVE underlying tokens from user to contract failed");
        
            //deposit into AAVE
            IAAVEPool(AAVEPoolAddress).supply(_token, _amount, msg.sender, 0);
            userBalances[msg.sender][_token] += _amount; //update user balance
        } else if (isAAVEToken[_token]){
            require( IERC20(_token).transferFrom(msg.sender, address(this), _amount),"transferring aToken from user to contract failed");
            userBalances[msg.sender][_token] += _amount; //update user balance
        }
    }

    //unstake
    function unstake(address _token, uint _amount) public {
        require(isAAVEUnderlying[_token] || isAAVEToken[_token], "Not an approved token to stake on NEKO.");
        uint256 balance = userBalances[msg.sender][_token];
        require(balance > 0, "user has 0 tokens staked");
        require(_amount <= balance, "amount is higher than balance");

        userBalances[msg.sender][_token] -= _amount;

        require(IERC20(_token).transfer(msg.sender, _amount),"transfer from contract to user failed");
    }

    //foundation withdraw all tokens

    function withdraw() public {
        require(msg.sender == foundationAddress, "can only be called by cat charity foundation");
        address[] memory allTokens_ = allTokens;
        uint256 allTokensLength = allTokens_.length;

        for(uint i; i < allTokensLength; i++){
            address token = allTokens[i];
            uint256 amount = IERC20(token).balanceOf(address(this));
            if(amount > 0){
                require(IERC20(allTokens[i]).transfer(msg.sender, amount), "contract to foundation transfer failed");
            }
        }
    }



}
