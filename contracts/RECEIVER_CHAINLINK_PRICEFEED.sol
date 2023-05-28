// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract NEKO_TEST_TOKEN_RECEIVER {

    address owner;
    mapping(address => bool) public receiverAuth;
    mapping(address => uint256) public tokensWithdrawn;
    mapping(address => uint256) public USDWithdrawnPerToken;

    address[] public knownTokens;


    /* USDC = $1 */ 
    AggregatorV3Interface internal BTCDataFeed;
    AggregatorV3Interface internal ETHDataFeed;
    AggregatorV3Interface internal LINKDataFeed;
    /* DAI = $1 */
    

    address public USDCAddress;
    address public WETHAddress;
    address public WBTCAddress;
    address public LINKAddress;
    address public DAIAddress;


    constructor(address[] memory _startTokens){
        owner = msg.sender;
        ETHDataFeed = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);
        BTCDataFeed = AggregatorV3Interface(0x007A22900a3B98143368Bd5906f8E17e9867581b);
        LINKDataFeed = AggregatorV3Interface(0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408);

        USDCAddress = _startTokens[0];
        WETHAddress = _startTokens[1];
        WBTCAddress = _startTokens[2];
        LINKAddress = _startTokens[3];
        DAIAddress = _startTokens[4];

        knownTokens.push(USDCAddress);
        knownTokens.push(WETHAddress);
        knownTokens.push(WBTCAddress);
        knownTokens.push(LINKAddress);
        knownTokens.push(DAIAddress);

    }

    struct donated {
        address token;
        uint256 amount;
    }

    modifier onlyReceiver() {
        require(receiverAuth[msg.sender] || msg.sender == owner, "only receivers can receive tokens");
        _;
    }

    function addReceiver(address _receiver) public {
        receiverAuth[_receiver] = true;
    }

    function addKnown(address _token) public {
        knownTokens.push(_token);
    }

    function withdrawKnown() onlyReceiver public {
        address[] memory knownTokens_ = knownTokens;
        uint256 length = knownTokens_.length;
        for(uint i; i < length; i++){
            address token = knownTokens_[i];
            uint256 amount = IERC20(token).balanceOf(address(this));
            if (amount > 0){
                IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
                tokensWithdrawn[token] += amount;
                uint256 usdCost = getTokenPrice(token, amount);
                USDWithdrawnPerToken[token] += usdCost;
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

    function getTotalWithdrawnUSD() public view returns (uint256) {
        uint256 withdrawnTotalUSD;
        uint256 USDCTotal = USDWithdrawnPerToken[USDCAddress];
        uint256 WETHTotal = USDWithdrawnPerToken[WETHAddress];
        uint256 WBTCTotal = USDWithdrawnPerToken[WBTCAddress];
        uint256 LINKTotal = USDWithdrawnPerToken[LINKAddress];
        uint256 DAITotal = USDWithdrawnPerToken[LINKAddress];
        withdrawnTotalUSD += (USDCTotal + WETHTotal + WBTCTotal + LINKTotal + DAITotal);
        return withdrawnTotalUSD;
    }

    function getETHPrice() public view returns(uint256) {
        (,int price,,,) = ETHDataFeed.latestRoundData();
        uint256 price_ = uint256(price);
        return price_;

    }

    function getBTCPrice() public view returns(uint256) {
        (,int price,,,) = BTCDataFeed.latestRoundData();
        uint256 price_ = uint256(price);
        return price_;

    }

    function getLINKPrice() public view returns(uint256) {
        (,int price,,,) = LINKDataFeed.latestRoundData();
        uint256 price_ = uint256(price);
        return price_;

    }

    function getTokenPrice(address _token, uint256 amount) public view returns (uint256) {
        if (_token == USDCAddress || _token == DAIAddress) {
            // USDC and DAI are hardcoded to be $1
            return amount / 1e16;
        } else if (_token == WETHAddress) {
            // Get the price of WETH
            uint256 ethPrice = getETHPrice();
            return amount * ethPrice / 1e24;
        } else if (_token == WBTCAddress) {
            // Get the price of WBTC
            uint256 btcPrice = getBTCPrice();
            return amount * btcPrice / 1e24;
        } else if (_token == LINKAddress) {
            // Get the price of LINK
            uint256 linkPrice = getLINKPrice();
            return amount * linkPrice / 1e24;
        } else {
            // Unsupported token
            revert("Unsupported token");
        }
    }




    

}
