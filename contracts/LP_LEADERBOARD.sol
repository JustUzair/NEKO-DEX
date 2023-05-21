//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title NEKO DEX LP_LEADERBOARD
/// @author gas-limit.eth
/// @notice This contract allows users to lock LP tokens and earn points based on the amount of time they have locked their LP tokens.
/// @notice getLeaderboard() returns all user scores in descending order

/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠔⠒⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠢⠤⢄⣀⠀⠀⠀⠀⠀⠀⠈⢢⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠨⠧⠀⠀⠀⠀⢀⡾⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⠤⠔⠒⠉⠉⠁⠀⠀⢀⣀⠤⠴⠚⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡠⠖⠊⠁⠀⠀⣀⠠⠄⠒⠂⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣴⠀⠀⠀⠰⡋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⠁⠒⠒⠒⠛⠓⠶⣒⠀⠀⠀⠠⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣀⣤⠴⠶⠓⠓⢛⡟⠉⠉⢉⠽⠛⠓⠲⠦⣤⣄⡀⠀⠀⠀⠀⠀⠀
⠀⢀⣶⡟⠉⠀⠀⠀⣀⣖⣉⣠⣴⣮⣥⣀⣀⡀⠀⠀⠀⠉⠻⣶⡀⠀⠀⠀⠀
⠀⣾⣿⣧⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣷⣤⣄⠀⣸⣇⣀⣀⡀⠀
⠀⢹⣿⣿⣿⣧⣿⣯⣭⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⠿⠿⢿⣿⠥⢄⠹⡄
⠀⠈⣿⣿⣿⣉⠉⠉⠛⠛⠛⠿⠟⠛⠛⠛⠛⠛⠉⠀⠀⠀⢠⡿⠁⠀⢸⠀⡇
⠀⠀⠘⣿⣿⣿⣤⡀⠀⠀⠀⠀N E K O⠀⠀⠀⢀⡞⠁⢀⡴⣋⠞⠁
⠀⠀⠀⠙⣿⣿⣿⣷⡆⢀⠀⠀D E X⠀⠀⠀⠀⣠⣿⡷⠭⠷⠊⠁⠀⠀
⠀⢀⣤⠶⠿⢻⣿⣿⣿⣷⣷⣦⣀⣀⣀⠀⡀⣀⣴⡞⠻⠶⣤⡀⠀⠀⠀⠀⠀
⣼⠋⠀⠀⢰⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠟⣛⡏⠉⠻⡦⠀⠈⣿⡆⠀⠀⠀⠀
⣿⣜⢆⡀⠸⢿⢯⡉⢉⣉⠉⠉⠛⠋⠉⠉⠉⠀⣀⠜⠁⠀⠀⢋⡿⠀⠀⠀⠀
⠈⠙⠿⣿⣶⣦⣤⣈⣀⡀⠁⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣴⠶⠛⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠉⠙⠛⠻⠿⠿⠿⠿⠿⠿⠒⠒⠒⠚⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀
*/

contract LP_LEADERBOARD {
    mapping(address => mapping(address => uint256)) public userLockedBalances; /// @notice user address -> token -> amount
    mapping(address => mapping(address => lock)) public userLocks; //user address -> token -> lock
    mapping(uint256 => address) public userIdToAddress; /// @notice userId -> user address
    mapping(address => uint256) public addressToUserId; /// @notice user address -> userId
    uint256 public userIdCounter; /// @notice counter for userIds

    mapping(address => userScore) public userScores; /// @notice user address -> userScore

    address[] public LPTokens; /// @notice array of approved LP tokens


    /// @notice userScore struct
    struct userScore {
        address user; // user address
        uint256 score; // user score
    }

    /// @notice lock struct
    struct lock {
        uint256 lockTime;// time of lock
        uint256 unlockTime; // time of unlock
    }
    
    /// @notice constructor
    /// @param _LPTokens array of approved LP tokens
    constructor(address[] memory _LPTokens){
        LPTokens = _LPTokens;
    }

    /// @notice checks if a token is an approved LP token
    /// @param _token token address
    function isLPToken(address _token) public view returns(bool isToken){
        address[] memory LPTokens_ = LPTokens; // gas optimization
        uint256 arrLength = LPTokens_.length; // gas optimization
        for(uint i; i < arrLength; i++){ /// @notice loop through array of approved LP tokens
            if(LPTokens_[i] == _token){ /// @notice if token is in array, return true
                isToken = true;
            }
        }
    }

    /// @notice deposit LP tokens into contract
    /// @param _token  token address
    /// @param _amount  amount of tokens to deposit
    function depositLP(address _token, uint256 _amount) public {
        require(isLPToken(_token), "Not an approved token");
        require(_amount > 0, "deposit amount must be more than 0");
        require(userLockedBalances[msg.sender][_token] == 0,"already locked");
        require(userLocks[msg.sender][_token].unlockTime == 0, "already locked"); //redundant but yolo
        if(addressToUserId[msg.sender] != 0){
            require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "tx failed");
            userLockedBalances[msg.sender][_token] += _amount;
            userLocks[msg.sender][_token].lockTime = block.timestamp;
        }
        else {
            require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "tx failed");
            uint256 userIdCounter_ = ++userIdCounter;
            addressToUserId[msg.sender] = userIdCounter_;
            userIdToAddress[userIdCounter_] = msg.sender;
            userLockedBalances[msg.sender][_token]+=_amount;
            userLocks[msg.sender][_token].lockTime = block.timestamp;
        }
    }

    /// @notice withdraw LP tokens from contract
    /// @notice removes balnce of specified LP tokens from contract and adds score to user score struct
    /// @param _token  token address
    function withdrawLP(address _token) public {
        require(isLPToken(_token),"address is invalid!"); /// @notice check if token is approved
        uint256 amount = userLockedBalances[msg.sender][_token]; /// @notice get amount of tokens locked
        require(IERC20(_token).transfer(msg.sender, amount),"transfer failed"); /// @notice transfer tokens to user
        userLocks[msg.sender][_token].unlockTime = block.timestamp; /// @notice set unlock time
        uint256 lockTime = userLocks[msg.sender][_token].lockTime; /// @notice get lock time
        uint256 unlockTime = block.timestamp; /// @notice get unlock time
        /// score is calculated by subtracting the unlock time from the lock time, then multiplying by the amount of tokens locked, then dividing by 10 ** 16
        /// (lock time * amount of tokens locked) / 10 ** 16
        uint256 score = (((unlockTime - lockTime) * userLockedBalances[msg.sender][_token]) / 10 ** 16); /// @notice calculate score
        userScores[msg.sender].score +=  score; /// @notice add score to user score struct
        delete userLockedBalances[msg.sender][_token]; /// @notice delete user balance
    }

    /// @notice get user scor
    /// @dev user score is calculated by adding the amount of time each LP token has been locked for
    /// lock time is calculated by subtracting the unlock time from the lock time, then multiplying by the amount of tokens locked, then dividing by 10 ** 16
    /// (lock time * amount of tokens locked) / 10 ** 16
    function getIndividualScore() public view returns (uint256){
        uint256 estimatedScore = userScores[msg.sender].score;
        for(uint i; i < LPTokens.length; i++){
            address token = LPTokens[i];
            uint256 lockTime = userLocks[msg.sender][token].lockTime;
            estimatedScore += userLockedBalances[msg.sender][token] * (block.timestamp - lockTime);
        }
       
        return estimatedScore / 10**16;
    } 

    /// @notice returns an array of userScore structs in descending order of score
    /// @dev leaderboard is calculated by adding the amount of time each LP token has been locked for
    /// lock time is calculated by subtracting the unlock time from the lock time, then multiplying by the amount of tokens locked, then dividing by 10 ** 16
    /// (lock time * amount of tokens locked) / 10 ** 16
    function getLeaderboard() public view returns (userScore[] memory) {
        userScore[] memory scores = new userScore[](userIdCounter);

        for (uint256 i = 1; i <= userIdCounter; i++) {
            address user = userIdToAddress[i];
            uint256 totalScore;
            for (uint256 j = 0; j < LPTokens.length; j++) {
                address token = LPTokens[j];
                uint256 lockTime = userLocks[user][token].lockTime;
                totalScore += userLockedBalances[user][token] * (block.timestamp - lockTime);
            }
            scores[i - 1] = userScore(user, totalScore);
        }

        // Sort scores in descending order
        for (uint256 i = 0; i < userIdCounter - 1; i++) {
            for (uint256 j = 0; j < userIdCounter - i - 1; j++) {
                if (scores[j].score < scores[j + 1].score) {
                    userScore memory temp = scores[j];
                    scores[j] = scores[j + 1];
                    scores[j + 1] = temp;
                }
            }
        }

        return scores;
    }

    

}
