// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NEKO_TEST_TOKEN_RECEIVER {

    address owner;
    mapping(address => bool) public receiverAuth;
    mapping(address => uint256) public tokensWithdrawn;

    address[] public knownTokens;

    constructor(){
        owner = msg.sender;
    }

    struct donated {
        address token;
        uint256 amount;
    }

    modifier onlyReceiver() {
        require(receiverAuth[msg.sender] || msg.sender == owner, "only receivers can receive tokens");
        _;
    }

    function withdrawToken(address _token) onlyReceiver public {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
        tokensWithdrawn[_token] += amount;
    }

    function addReceiver(address _receiver) onlyReceiver public {
        receiverAuth[_receiver] = true;
    }

    function addTokens(address _token) public onlyReceiver {
        knownTokens.push(_token);
    }

    function withdrawKnown() public onlyReceiver{
        address[] memory knownTokens_ = knownTokens;
        uint256 length = knownTokens_.length;
        for(uint i; i < length; i++){
            address token = knownTokens_[i];
            uint256 amount = IERC20(token).balanceOf(address(this));
        if (amount > 0){
            IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
            tokensWithdrawn[token] += amount;
            }
        }
    }

    function getKnownTokensDonated() public view returns (donated[] memory) {
        address[] memory knownTokens_ = knownTokens;
        uint256 length = knownTokens_.length;
        donated[] memory donated_ = new donated[](length); 
        for(uint i; i < length; i++){
            address token = knownTokens_[i];
            uint amount = tokensWithdrawn[token];
            donated_[i] = (donated(token,amount));
        }
        return donated_;
    }

}
