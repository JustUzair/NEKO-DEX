//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/// @title Leaderboard
/// @author gas-limit.eth
/// @notice This contract allows users to stake LP tokens and earn points based on the amount of time they have staked
/// @dev Tracks user staking batches and calculate scores for a leaderboard.


contract Leaderboard {

    mapping(address => batch[]) public userBatches; // maps user address to an array of batches
    mapping(uint => address) public idToAddress; // maps user ID to user address, used for indexing all users
    uint idCount; // keeps track of the number of users

    address[] LPTokens; // array of LP tokens that are supported by the leaderboard

    // struct to store data for each batch
    struct batch {
        address user;
        address token;
        uint256 amount;
        uint256 start;
        uint256 score;
        uint256 end;
    }

    struct pointData {
        address user;
        uint256 points;
    }

    constructor(address[] memory _LPTokens) {
        LPTokens = _LPTokens;
    }

    function stakeTokens(address _token, uint256 _amount) public {
        require(checkLPTokens(_token), "entered address is not an LP token");

        uint idCount_ = idCount; // store idCount in memory
        bool isRegistered; // variable to store if user is registered

        // loop through idToAddress to check if user is registered
        for(uint i; i < idCount_; i++){
            address userCompare = idToAddress[i];
            if(msg.sender == userCompare) {
                isRegistered = true;
            }
        }
        // if user is registered, push stakeData into userAllStakeData
        if(isRegistered) {
            //push stakeData into userAllStakeData
            userBatches[msg.sender].push(batch(msg.sender, _token, _amount, block.timestamp, 0, 0));
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        } else {
            // if user is not registered, register user
            // assign new user an ID number
            idToAddress[idCount] = msg.sender;
            IERC20(_token).transferFrom(msg.sender, address(this), _amount);
            userBatches[msg.sender].push(batch(msg.sender, _token, _amount, block.timestamp, 0, 0));
            ++idCount; // increment count
        }
 

    }

    /// @notice Unstakes tokens from a batch
    /// @param _batchIndex The index of the batch to unstake
    function unstakeTokens(uint _batchIndex) public {
        //user can decide which batch to unstake usingBatchIndex
        batch[] memory userBatches_ = userBatches[msg.sender];
        uint startTime = userBatches_[_batchIndex].start; // get start time of batch
        uint amount = userBatches_[_batchIndex].amount; // get amount of tokens staked
        address token_ = userBatches_[_batchIndex].token; // get token address

        if(userBatches_[_batchIndex].end == 0){
            uint totalTime; // variable to store total time staked
            uint transferAmount = userBatches_[_batchIndex].amount; // variable to store amount of tokens to transfer back to user
            userBatches[msg.sender][_batchIndex].end = block.timestamp; // set end time of batch to current block timestamp
            totalTime = (block.timestamp - startTime); // calculate total time staked
            userBatches[msg.sender][_batchIndex].score = totalTime * amount; // calculate score for batch
            IERC20(token_).transfer(msg.sender, transferAmount); // transfer tokens back to user
        }
        else{
            revert("batch has already been unstaked"); // if batch has already been unstaked, revert
        }

        
    }

    //function to check if an input token address is in the LPTokens array
    function checkLPTokens(address _token) public view returns (bool) {
        bool isLP;
        for(uint i; i < LPTokens.length; i++){
            if(_token == LPTokens[i]){
                isLP = true;
            }
        }
        return isLP;
    }

    // function that returns an array of pointData[] that contains the top 10 users in decending order
    function getLeaderboard() public view returns (pointData[] memory) {
        pointData[] memory leaderboard = new pointData[](idCount); // create array of pointData structs
        for(uint i; i < idCount; i++){
            address user = idToAddress[i]; // get user address
            uint256 points = getIndividualScore(user); // get user score
            leaderboard[i] = pointData(user, points); // create pointData struct and add to leaderboard array
        }
        // sort leaderboard array in decending order
        for(uint i; i < leaderboard.length; i++){
            for(uint j; j < leaderboard.length; j++){
                if(leaderboard[i].points > leaderboard[j].points){
                    pointData memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
        // return top 10 users
        pointData[] memory top10 = new pointData[](10);
        for(uint i; i < 10; i++){
            top10[i] = leaderboard[i];
        }
        return top10;
    }

    /// @notice Gets the score of a user
    /// @param _user The address of the user
    /// @return score The score of the user
    function getIndividualScore(address _user) public view returns (uint256 score) {
    batch[] memory userBatch = userBatches[_user]; // get all batches for user

    // loop through batches and calculate score
    for(uint i = 0; i < userBatch.length; i++){
        uint amount = userBatch[i].amount; // get amount of tokens staked
        uint start = userBatch[i].start; // get start time of batch
        uint end = userBatch[i].end; // get end time of batch
        // if batch has not been unstaked, use current block timestamp as end time
        if(end == 0){
            uint time = block.timestamp - start;
            score += time * amount; // calculate score
        }
        // if batch has been unstaked, use end time as end time
        else {
            uint time = end - start;
            score += time * amount; // calculate score
        }
    }
    // score = (time * amount ) / 10**16
    return score / 10000000000000000;
}


    /// @notice Gets all batches for a user
    function getUserBatches(address _user) public view returns (batch[] memory) {
        return userBatches[_user];
    }

    

}
