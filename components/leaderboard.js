import { ST } from "next/dist/shared/lib/utils";
import ierc20Abi from "../constants/ierc20Abi.json";
import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import contractAddresses from "../constants/networkMappings.json";
import { useNotification } from "web3uikit";
import DEXAbi from "../constants/DEXAbi.json";
import { ethers } from "ethers";
import leaderboardAbi from "../constants/LeaderboardAbi.json";
export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState(1);

  const [selectedOption, setSelectedOption] = useState("nekoWETHLP");
  const [nekoPoolLPBalance, setNekoPoolLPBalance] = useState(0);
  const [nekoPoolLPTokenStakeAmount, setNekoPoolLPTokenStakeAmount] =
    useState(0);

  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LeaderboardAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["Leaderboard"][
          contractAddresses[chainId]["Leaderboard"].length - 1
        ]
      : null;
  let PoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const dispatch = useNotification();
  //****************************************************************/
  //-----------------------NOTIFICATION-----------------------------
  //****************************************************************/

  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg} Successfully! `,
      title: `${msg}`,
      position: "topR",
    });
  };

  const failureNotification = msg => {
    dispatch({
      type: "error",
      message: `${msg} ( View console for more info )`,
      title: `${msg}`,
      position: "topR",
    });
  };
  //****************************************************************/
  //--------------------END NOTIFICATION-----------------------------
  //****************************************************************/
  const StakeLPToken = async () => {
    if (nekoPoolLPTokenStakeAmount <= 0) {
      failureNotification(
        "Values of the lp tokens to stake should be greater than 0!!"
      );
      return;
    }
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      let enoughLiquidity = false;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: PoolContractAddress,
          functionName: "balanceOf",
          params: {
            account,
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          const value = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          console.log(value < nekoPoolLPTokenStakeAmount);
          if (value < nekoPoolLPTokenStakeAmount) {
            failureNotification("You do not have enough funds for staking!");
            return;
          }
          enoughLiquidity = true;
          console.log("balance ether : ", data.toString());
        },
      });
      if (!enoughLiquidity) return;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: PoolContractAddress,
          functionName: "approve",
          params: {
            spender: LeaderboardAddress,
            amount: ethers.utils
              .parseEther(nekoPoolLPTokenStakeAmount)
              .toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve lp", data);
        },
      });

      await runContractFunction({
        params: {
          abi: leaderboardAbi,
          contractAddress: LeaderboardAddress,
          functionName: "depositLP",
          params: {
            _token: PoolContractAddress,
            _amount: ethers.utils
              .parseEther(nekoPoolLPTokenStakeAmount)
              .toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: async data => {
          //   console.log("swap", data);
          successNotification(
            `TX : ${data.hash} (View on ${
              (chainId == 80001 && "Mumbai Polygonscan") ||
              (chainId == 137 && "Polygonscan")
            } ) `
          );
          await data.wait(1);
          successNotification(`Assets Staked `);
        },
      });
    }
  };

  const getDEXLPBalanceOfUser = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: PoolContractAddress,
          functionName: "balanceOf",
          params: {
            account,
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          const value = ethers.utils.formatUnits(data.toString(), "ether");
          setNekoPoolLPBalance(value);
        },
      });
    }
  };
  useEffect(() => {
    getDEXLPBalanceOfUser();
  }, [account, selectedOption]);
  const Buttons = () => {
    return (
      <div style={{ padding: "15px" }}>
        {activeTab != 1 && (
          <button className="modalButton" onClick={() => setActiveTab(1)}>
            Leaderboard
          </button>
        )}
        {activeTab != 2 && (
          <button className="modalButton" onClick={() => setActiveTab(2)}>
            Stake LP
          </button>
        )}
        {activeTab != 3 && (
          <button className="modalButton" onClick={() => setActiveTab(3)}>
            Unstake LP
          </button>
        )}
      </div>
    );
  };

  const handleSelectChange = event => {
    setSelectedOption(event.target.value);
  };

  let imageUrl;

  switch (selectedOption) {
    case "nekoWETHLP":
      imageUrl = "https://i.ibb.co/CWfhL6J/image.png";
      PoolContractAddress =
        chainId in contractAddresses
          ? contractAddresses[chainId]["ETHPool"][
              contractAddresses[chainId]["ETHPool"].length - 1
            ]
          : null;
      break;
    case "nekoWBTCLP":
      imageUrl = "https://i.ibb.co/YRYQ82y/image.png";
      PoolContractAddress =
        chainId in contractAddresses
          ? contractAddresses[chainId]["WBTCPool"][
              contractAddresses[chainId]["WBTCPool"].length - 1
            ]
          : null;
      break;
    case "nekoMATICLP":
      imageUrl = "https://i.ibb.co/ZLW9d4x/image.png";
      PoolContractAddress =
        chainId in contractAddresses
          ? contractAddresses[chainId]["WMATICPool"][
              contractAddresses[chainId]["WMATICPool"].length - 1
            ]
          : null;
      break;
    case "nekoDAILP":
      imageUrl = "https://i.ibb.co/26fPzxF/image.png";
      PoolContractAddress =
        chainId in contractAddresses
          ? contractAddresses[chainId]["DAIPool"][
              contractAddresses[chainId]["DAIPool"].length - 1
            ]
          : null;
      break;
    default:
      imageUrl = "path/to/default-image.jpg";
      PoolContractAddress =
        chainId in contractAddresses
          ? contractAddresses[chainId]["ETHPool"][
              contractAddresses[chainId]["ETHPool"].length - 1
            ]
          : null;
      break;
  }

  const StakeLP = () => {
    return (
      <>
        <h1
          style={{
            marginLeft: "15px",
            color: "white",
            textShadow: "4px 4px 4px black",
          }}
        >
          Stake LP
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: "15px",
              margin: "15px",
              border: "1px solid black",
              borderRadius: "6px",
              width: "50%",
              objectPosition: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "baseline",
                height: "13vh",
                marginBottom: "10px",
              }}
            >
              <img
                style={{
                  maxWidth: "100px",
                  maxHeight: "75px",
                  margin: "0 auto",
                }}
                src={imageUrl}
                alt="Selected Image"
              />
              {/* Choose which LP to stake in a dropdown Menu */}
              <select
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  borderRadius: "6px",
                  padding: "15px",
                  background: "black",
                  color: "white",
                  margin: "0 auto",
                }}
              >
                <option value="nekoWETHLP">nekoWETHLP</option>
                <option value="nekoWBTCLP">nekoWBTCLP</option>
                <option value="nekoMATICLP">nekoMATICLP</option>
                <option value="nekoDAILP">nekoDAILP</option>
              </select>
            </div>
            <input
              style={{ marginLeft: "15px", marginBottom: "12px" }}
              className="asset"
              type="text"
              autoFocus="autoFocus"
              placeholder="Amount to Stake"
              onChange={e => {
                setNekoPoolLPTokenStakeAmount(e.target.value);
              }}
              value={nekoPoolLPTokenStakeAmount}
            ></input>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  marginLeft: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: "#fff",
                }}
                title={nekoPoolLPBalance}
              >
                LP Balance : ~{parseFloat(nekoPoolLPBalance).toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  marginLeft: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: "blueviolet",
                  padding: "3px 5px",
                  borderRadius: "4px",
                  color: "white",
                }}
                title={nekoPoolLPBalance}
                onClick={e => {
                  setNekoPoolLPTokenStakeAmount(nekoPoolLPBalance);
                }}
              >
                Stake All ?
              </span>
            </div>
            <button
              style={{ marginLeft: "15px" }}
              className="swapButton"
              onClick={StakeLPToken}
            >
              Stake
            </button>
          </div>
          <Stakes />
        </div>
        <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
              ⌛ Stake your LP Tokens to gain a <br /> spot on the leaderboard!
              ➕
            </div>
          </div>
        </div>
      </>
    );
  };

  const UnstakeLP = () => {
    return (
      <>
        <h1
          style={{
            marginLeft: "15px",
            color: "white",
            textShadow: "4px 4px 4px black",
          }}
        >
          Unstake LP
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: "15px",
              margin: "15px",
              border: "1px solid black",
              borderRadius: "6px",
              width: "50%",
              objectPosition: "center",
            }}
          >
            {/* Choose which LP to stake in a dropdown Menu */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "baseline",
                height: "13vh",
                marginBottom: "10px",
              }}
            >
              <img
                style={{
                  maxWidth: "100px",
                  maxHeight: "75px",
                  margin: "0 auto",
                }}
                src={imageUrl}
                alt="Selected Image"
              />
              <select
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  borderRadius: "6px",
                  padding: "15px",
                  background: "black",
                  color: "white",
                  margin: "0 auto",
                }}
              >
                <option value="nekoWETHLP">nekoWETHLP</option>
                <option value="nekoWBTCLP">nekoWBTCLP</option>
                <option value="nekoMATICLP">nekoMATICLP</option>
                <option value="nekoDAILP">nekoDAILP</option>
              </select>
            </div>
            <br />{" "}
            <button style={{ marginLeft: "15px" }} className="swapButton">
              Unstake all
            </button>
          </div>
          <Stakes />
        </div>
        <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
              ⏰ Unstake your LP Tokens and <br /> stop gaining points ❌
            </div>
          </div>
        </div>
      </>
    );
  };

  const Stakes = () => {
    return (
      <div
        style={{
          padding: "15px",
          paddingTop: "0px",
          margin: "15px",
          border: "1px solid black",
          borderRadius: "6px",
          maxWidth: "50%",
          color: "white",
          textShadow: "4px 4px 4px black",
        }}
      >
        <h4>Your LP Tokens</h4>

        <table>
          <tr>
            <th>LP Token</th>
            <th>Unstaked</th>
            <th>Staked</th>
          </tr>
          <tr>
            <td>nekoWETHLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoWBTCLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoMATICLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoDAILP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
        </table>
      </div>
    );
  };

  const Top10 = () => {
    return (
      <>
        <div style={{ padding: "15px", margin: "15px", borderRadius: "6px" }}>
          <div
            style={{
              fontSize: "30px",
              marginBottom: "15px",
              color: "white",
              textShadow: "4px 4px 4px black",
            }}
          >
            Leaderboard{" "}
          </div>

          {/* <div style={{fontSize: "10px"
              ,width:"150px",
               border: "black solid 1px", 
               marginTop:"-30px", 
               marginLeft:"450px", 
               padding:"5px"}}>Users who own the most <br/> LP tokens will be listed here</div>  
                 */}
          <table
            style={{
              background: "white",
              boxShadow: "inset 0 0 6px black",
              borderRadius: "6px",
            }}
          >
            <tbody>
              <tr>
                <th>Rank</th>
                <th>Address</th>
                <th>Points</th>
              </tr>
              <tr>
                <td>1</td>
                <td>gas-limit.eth</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>JustUzair.eth</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Inzhagi.eth</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>4</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>5</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>6</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>7</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>8</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>9</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>10</td>
                <td>0x1234...5678</td>
                <td>1000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
              🏆 The Top 10 liquidity providers
            </div>
          </div>
        </div>
      </>
    );
  };
  if (activeTab === 1) {
    return (
      <>
        <Top10 />
        <Buttons />
      </>
    );
  }
  if (activeTab == 2) {
    return (
      <>
        <StakeLP />
        <Buttons />
      </>
    );
  }
  if (activeTab == 3) {
    return (
      <>
        <UnstakeLP />

        <Buttons />
      </>
    );
  }
};
