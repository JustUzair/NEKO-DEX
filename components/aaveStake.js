import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import contractAddresses from "../constants/networkMappings.json";
import ierc20Abi from "../constants/ierc20Abi.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import aaveStakingAbi from "../constants/AAVEStakingAbi.json";
export const AaveStake = () => {
  const [activeTab, setActiveTab] = useState(2);
  const [currentTokenBalance, setCurrentTokenBalance] = useState("0");
  const [tokenDepositAmount, setTokenDepositAmount] = useState("0");
  const [tokenWithdrawAmount, setTokenWithdrawAmount] = useState("0");

  const [selectedOption, setSelectedOption] = useState("LINK");

  // *****************************  STAKED AMOUNT VARIABLES *****************************
  const [ethStakedBalance, setETHStakedBalance] = useState(0);

  const [wbtcStakedBalance, setWBTCStakedBalance] = useState(0);

  const [linkStakedBalance, setLINKStakedBalance] = useState(0);

  const [daiStakedBalance, setDAIStakedBalance] = useState(0);
  const [usdcStakedBalance, setUSDCStakedBalance] = useState(0);

  // ***************************** END STAKED AMOUNT VARIABLES  *****************************

  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const AAVEStakingAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["AAVEStaking"][
          contractAddresses[chainId]["AAVEStaking"].length - 1
        ]
      : null;
  // -------------------  DEX POOLS ADDRESS    -------------------
  const WETHContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
        ]
      : null;
  const WBTCContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
        ]
      : null;
  const LINKContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
        ]
      : null;
  const USDCContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const DAIContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAI"][
          contractAddresses[chainId]["DAI"].length - 1
        ]
      : null;
  // ------------------- END DEX POOLS ADDRESS    -------------------

  let ContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
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
  //*************************************************************************************** */
  // ******************** Stake Tokens  ***************************
  //*************************************************************************************** */

  const StakeToken = async () => {
    // DEPOSIT TOKEN
    if (tokenDepositAmount <= 0) {
      failureNotification(
        "Values of the token to stake should be greater than 0!!"
      );
      return;
    }
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      let enoughLiquidity = false;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: ContractAddress,
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
          console.log(value < tokenDepositAmount);
          if (value < tokenDepositAmount) {
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
          contractAddress: ContractAddress,
          functionName: "approve",
          params: {
            spender: AAVEStakingAddress,
            amount: ethers.utils.parseEther(tokenDepositAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: async data => {
          console.log("approve lp", data);
          await data.wait(1);
        },
      });

      await runContractFunction({
        params: {
          abi: aaveStakingAbi,
          contractAddress: AAVEStakingAddress,
          functionName: "stake",
          params: {
            _token: ContractAddress,
            _amount: ethers.utils.parseEther(tokenDepositAmount).toString(),
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
              (chainId == 137 && "Polygonscan") ||
              (chainId == 65 && "OKX Testnet Explorer") ||
              (chainId == 66 && "OKX Mainnet Explorer") ||
              (chainId == 250 && "Ftmscan Mainnet Explorer") ||
              (chainId == 4002 && "Ftmscan Testnet Explorer")
            } ) `
          );
          await data.wait(1);
          setTokenDepositAmount(0);
          getCurrentTokenBalance();
          getAllStakedTokensAmount();
          successNotification(`Assets Staked `);
        },
      });
    }
  };
  //*************************************************************************************** */
  // ******************** END stake Tokens  ***************************
  //*************************************************************************************** */

  //*************************************************************************************** */
  // ********************   Unstake Tokens  ***************************
  //*************************************************************************************** */

  const UnstakeToken = async () => {
    if (!tokenWithdrawAmount || tokenWithdrawAmount == 0) return;
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      let assetsStaked = false;
      await runContractFunction({
        params: {
          abi: aaveStakingAbi,
          contractAddress: AAVEStakingAddress,
          functionName: "getBalance",
          params: {
            _user: account,
            _token: ContractAddress,
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          //   console.log(
          //     "Staked balance : ",
          //     ethers.utils.formatUnits(data.toString(), "ether").toString()
          //     // data.toString()
          //   );
          //   setAmount(
          //     ethers.utils.formatUnits(data.toString(), "ether").toString()
          //   );
          const value = ethers.utils
            .formatUnits(data.toString(), "ether")
            .toString();
          if (value <= 0) {
            failureNotification(
              "You have no assets staked for this asset/token"
            );
            return;
          } else assetsStaked = true;
        },
      });

      if (!assetsStaked) return;
      await runContractFunction({
        params: {
          abi: aaveStakingAbi,
          contractAddress: AAVEStakingAddress,
          functionName: "unstake",
          params: {
            _token: ContractAddress,
            _amount: ethers.utils.parseEther(tokenWithdrawAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: async data => {
          successNotification(
            `TX : ${data.hash} (View on ${
              (chainId == 80001 && "Mumbai Polygonscan") ||
              (chainId == 137 && "Polygonscan") ||
              (chainId == 65 && "OKX Testnet Explorer") ||
              (chainId == 66 && "OKX Mainnet Explorer") ||
              (chainId == 250 && "Ftmscan Mainnet Explorer") ||
              (chainId == 4002 && "Ftmscan Testnet Explorer")
            } ) `
          );
          await data.wait(1);
          setTokenDepositAmount(0);
          setTokenWithdrawAmount(0);
          getCurrentTokenBalance();
          getAllStakedTokensAmount();
          successNotification(`Assets Withdraw/Un-staked`);
        },
      });
    }
  };
  //*************************************************************************************** */
  // ******************** END Unstake Tokens  ***************************
  //*************************************************************************************** */

  const getCurrentTokenBalance = async () => {
    if (ContractAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: ContractAddress,
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
          setCurrentTokenBalance(value.toString());
        },
      });
    }
  };

  //*************************************************************************************** */
  // ********************     GET Staked Balance of all dex pools ***************************
  //*************************************************************************************** */
  const getStakedTokenAmount = async (tokenAddress, setAmount) => {
    if (!isWeb3Enabled) await enableWeb3();
    if (AAVEStakingAddress == null) return;
    if (tokenAddress == null) return;
    // console.log("error occurred here");

    if (account) {
      await runContractFunction({
        params: {
          abi: aaveStakingAbi,
          contractAddress: AAVEStakingAddress,
          functionName: "getBalance",
          params: {
            _user: account,
            _token: tokenAddress,
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log(
            "Staked balance : ",
            ethers.utils.formatUnits(data.toString(), "ether").toString()
          );
          setAmount(
            ethers.utils.formatUnits(data.toString(), "ether").toString()
          );
        },
      });
    }
  };

  const getAllStakedTokensAmount = async () => {
    if (
      WETHContractAddress == null ||
      WBTCContractAddress == null ||
      LINKContractAddress == null ||
      DAIContractAddress == null ||
      USDCContractAddress == null
    )
      return;
    await getStakedTokenAmount(WETHContractAddress, setETHStakedBalance);
    await getStakedTokenAmount(WBTCContractAddress, setWBTCStakedBalance);
    await getStakedTokenAmount(LINKContractAddress, setLINKStakedBalance);
    await getStakedTokenAmount(DAIContractAddress, setDAIStakedBalance);
    await getStakedTokenAmount(USDCContractAddress, setUSDCStakedBalance);
  };
  //*************************************************************************************** */
  // ********************   END Staked Balance of all dex pools ***************************
  //*************************************************************************************** */

  useEffect(() => {
    setTokenWithdrawAmount(0);
    setTokenDepositAmount(0);
    account != null && getCurrentTokenBalance();
    account != null && getAllStakedTokensAmount();
  }, [account, selectedOption]);
  const Buttons = () => {
    return (
      <div style={{ padding: "15px" }}>
        {activeTab != 2 && (
          <button
            style={{ position: "absolute", bottom: "60px", left: "100px" }}
            className="modalButton"
            onClick={() => setActiveTab(2)}
          >
            Stake Assets
          </button>
        )}
        {activeTab != 3 && (
          <button
            style={{ position: "absolute", bottom: "60px", left: "100px" }}
            className="modalButton"
            onClick={() => setActiveTab(3)}
          >
            Unstake Assets
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
    case "LINK":
      imageUrl = "https://app.aave.com/icons/tokens/link.svg";
      ContractAddress = LINKContractAddress;
      break;
    case "WETH":
      imageUrl = "https://app.aave.com/icons/tokens/weth.svg";
      ContractAddress = WETHContractAddress;
      break;
    case "USDC":
      imageUrl = "https://app.aave.com/icons/tokens/usdc.svg";
      ContractAddress = USDCContractAddress;
      break;
    case "WBTC":
      imageUrl = "https://app.aave.com/icons/tokens/wbtc.svg";
      ContractAddress = WBTCContractAddress;
      break;
    // case "MaticX":
    //   imageUrl = "https://app.aave.com/icons/tokens/maticx.svg";
    //   break;
    // case "USDT":
    //   imageUrl = "https://app.aave.com/icons/tokens/usdt.svg";
    //   break;
    case "DAI":
      imageUrl = "https://app.aave.com/icons/tokens/dai.svg";
      ContractAddress = DAIContractAddress;

      break;
    // case "wstETH":
    //   imageUrl = "https://app.aave.com/icons/tokens/wsteth.svg";
    //   break;
    // case "GHST":
    //   imageUrl = "https://app.aave.com/icons/tokens/ghst.svg";
    //   break;
    // case "LINK":
    //   imageUrl = "https://app.aave.com/icons/tokens/link.svg";
    //   break;
    // case "BAL":
    //   imageUrl = "https://app.aave.com/icons/tokens/bal.svg";
    //   break;
    // case "EURS":
    //   imageUrl = "https://app.aave.com/icons/tokens/eurs.svg";
    //   break;
    // case "CRV":
    //   imageUrl = "https://app.aave.com/icons/tokens/crv.svg";
    //   break;
    // case "agEUR":
    //   imageUrl = "https://app.aave.com/icons/tokens/ageur.svg";
    //   break;
    // case "miMATIC":
    //   imageUrl = "https://app.aave.com/icons/tokens/mai.svg";
    //   break;
    // case "SUSHI":
    //   imageUrl = "https://app.aave.com/icons/tokens/stmatic.svg";
    //   break;
    // case "DPI":
    //   imageUrl = "https://app.aave.com/icons/tokens/dpi.svg";
    //   break;
    default:
      imageUrl = "https://app.aave.com/icons/tokens/link.svg";
      ContractAddress = LINKContractAddress;
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
          Cat toy donations
          <div style={{ fontSize: "15px" }}> powered by AAVE 👻</div>
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
                style={{ width: "100px", height: "75px", margin: "0 auto" }}
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
                  cursor: "pointer",
                }}
              >
                <option value="LINK">LINK</option>
                <option value="WETH">WETH</option>
                <option value="USDC">USDC</option>
                <option value="WBTC">WBTC</option>
                {/* <option value="MaticX">MaticX</option>
                <option value="USDT">USDT</option> */}
                <option value="DAI">DAI</option>
                {/* <option value="wstETH">wstETH</option>
                <option value="GHST">GHST</option>
                <option value="LINK">LINK</option>
                <option value="BAL">BAL</option>
                <option value="EURS">EURS</option>
                <option value="CRV">CRV</option>
                <option value="agEUR">agEUR</option>
                <option value="miMATIC">miMATIC</option>
                <option value="SUSHI">SUSHI</option>
                <option value="DPI">DPI</option> */}
              </select>
            </div>

            <div>
              <input
                style={{ margin: "15px" }}
                className="asset"
                type="text"
                placeholder="Amount to deposit"
                onChange={e => {
                  setTokenDepositAmount(e.target.value);
                }}
                value={tokenDepositAmount}
                autoFocus="autoFocus"
              ></input>
              <br />{" "}
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
                  title={currentTokenBalance}
                >
                  Token Balance : ~
                  {currentTokenBalance
                    .toLocaleString("fullwide", {
                      useGrouping: false,
                    })
                    .substr(0, 6) + "..."}
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
                  title={currentTokenBalance}
                  onClick={e => {
                    setTokenDepositAmount(currentTokenBalance);
                  }}
                >
                  Stake All ?
                </span>
              </div>
              <button
                style={{ marginLeft: "15px" }}
                className="swapButton"
                onClick={StakeToken}
              >
                Stake
              </button>
            </div>
          </div>
          <Stakes />
        </div>
        <div
          className="infoPanelLeaderboard"
          style={{
            // maxWidth: "350px",
            marginTop: "50px",
            marginRight: "80px",
            Index: "100",
          }}
        >
          <div
            className="typedOutWrapperLeaderboard"
            style={{ width: "1000px" }}
          >
            <div className="typedOutInfo">
              ⌛ Lock your funds to generate yields on AAVE, <br /> which are
              donated to charity. User deposits <br /> are available for
              withdrawal at any time. <br></br>Check out AAVE for the latest
              rates.
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
          Cat toy donations
          <div style={{ fontSize: "15px" }}> powered by AAVE 👻</div>
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
              <br />
              <br />

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
                <option value="LINK">LINK</option>
                <option value="WETH">WETH</option>
                <option value="USDC">USDC</option>
                <option value="WBTC">WBTC</option>
                {/* <option value="MaticX">MaticX</option> */}
                {/* <option value="USDT">USDT</option> */}
                <option value="DAI">DAI</option>
                {/* <option value="wstETH">wstETH</option>
                <option value="GHST">GHST</option>
                <option value="LINK">LINK</option>
                <option value="BAL">BAL</option>
                <option value="EURS">EURS</option>
                <option value="CRV">CRV</option>
                <option value="agEUR">agEUR</option>
                <option value="miMATIC">miMATIC</option>
                <option value="SUSHI">SUSHI</option>
                <option value="DPI">DPI</option> */}
              </select>
            </div>
            <div>
              <input
                style={{ margin: "15px" }}
                className="asset"
                type="text"
                placeholder="Amount to un-stake"
                onChange={e => {
                  setTokenWithdrawAmount(e.target.value);
                }}
                value={tokenWithdrawAmount}
                autoFocus="autoFocus"
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
                  title={
                    (selectedOption == "WETH" && ethStakedBalance) ||
                    (selectedOption == "DAI" && daiStakedBalance) ||
                    (selectedOption == "USDC" && usdcStakedBalance) ||
                    (selectedOption == "WBTC" && wbtcStakedBalance) ||
                    (selectedOption == "LINK" && linkStakedBalance)
                  }
                >
                  Total Staked : ~
                  {selectedOption == "WETH" &&
                    ethStakedBalance
                      .toLocaleString("fullwide", {
                        useGrouping: false,
                      })
                      .substr(0, 6) + "..."}
                  {selectedOption == "DAI" &&
                    daiStakedBalance
                      .toLocaleString("fullwide", {
                        useGrouping: false,
                      })
                      .substr(0, 6) + "..."}
                  {selectedOption == "USDC" &&
                    usdcStakedBalance
                      .toLocaleString("fullwide", {
                        useGrouping: false,
                      })
                      .substr(0, 6) + "..."}
                  {selectedOption == "WBTC" &&
                    wbtcStakedBalance
                      .toLocaleString("fullwide", {
                        useGrouping: false,
                      })
                      .substr(0, 6) + "..."}
                  {selectedOption == "LINK" &&
                    linkStakedBalance
                      .toLocaleString("fullwide", {
                        useGrouping: false,
                      })
                      .substr(0, 6) + "..."}
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
                  title={currentTokenBalance}
                  onClick={e => {
                    setTokenWithdrawAmount(
                      (selectedOption == "WETH" && ethStakedBalance) ||
                        (selectedOption == "DAI" && daiStakedBalance) ||
                        (selectedOption == "USDC" && usdcStakedBalance) ||
                        (selectedOption == "WBTC" && wbtcStakedBalance) ||
                        (selectedOption == "LINK" && linkStakedBalance)
                    );
                  }}
                >
                  Un-Stake All
                </span>
              </div>
              <button
                style={{ marginLeft: "15px" }}
                className="swapButton"
                onClick={UnstakeToken}
              >
                Unstake
              </button>
            </div>
          </div>

          <Stakes />
        </div>
        <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
              ⏰ Unstake your tokens and <br /> stop donating yields ❌
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
          width: "50%",
          color: "white",
          textShadow: "4px 4px 4px black",
        }}
      >
        <h4>Your locked assets</h4>

        <table>
          <tbody>
            <tr>
              <th>Token</th>
              <th>Staked</th>
            </tr>
            <tr>
              <td>LINK</td>
              <td title={linkStakedBalance}>
                {linkStakedBalance
                  .toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                  .substr(0, 6) + "..."}
              </td>
            </tr>
            <tr>
              <td>WETH</td>
              <td title={ethStakedBalance}>
                {/* {ethStakedBalance.substr(0, 6) + "..."} */}
                {ethStakedBalance
                  .toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                  .substr(0, 6) + "..."}
              </td>
            </tr>
            <tr>
              <td>USDC</td>
              <td title={usdcStakedBalance}>
                {/* {usdcStakedBalance.substr(0, 6) + "..."} */}
                {usdcStakedBalance
                  .toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                  .substr(0, 6) + "..."}
              </td>
            </tr>
            <tr>
              <td>WBTC</td>
              <td title={wbtcStakedBalance}>
                {/* {wbtcStakedBalance.substr(0, 6) + "..."} */}
                {wbtcStakedBalance
                  .toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                  .substr(0, 6) + "..."}
              </td>
            </tr>
            <tr>
              <td>DAI</td>
              <td title={daiStakedBalance}>
                {/* {daiStakedBalance.substr(0, 6) + "..."} */}
                {daiStakedBalance
                  .toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                  .substr(0, 6) + "..."}
              </td>
            </tr>
          </tbody>
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
  //   if (activeTab === 1) {
  //     return (
  //       <>
  //         {AAVEStakingAddress != null ? (
  //           <>
  //             <div className="modal" style={{ top: "100px" }}>
  //               <div className="modal-content">
  //                 <Top10 />
  //                 <Buttons />
  //               </div>
  //             </div>
  //           </>
  //         ) : (
  //           <>
  //             <div
  //               style={{
  //                 display: "flex",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 width: "80%",
  //                 height: "100%",
  //                 zIndex: "99",
  //                 color: "white",
  //                 fontSize: "2rem",
  //                 wordWrap: "break-word",
  //                 margin: "0 auto",
  //               }}
  //             >
  //               <span
  //                 style={{
  //                   background: "#FF494A",
  //                   padding: "10px 25px",
  //                   borderRadius: "20px",
  //                 }}
  //               >
  //                 No contract found on this network!!!
  //               </span>
  //             </div>
  //           </>
  //         )}
  //       </>
  //     );
  //   }
  if (activeTab == 2) {
    return (
      <div className="modal" style={{ top: "100px" }}>
        <div className="modal-content">
          {AAVEStakingAddress != null ? (
            <>
              <StakeLP />
              <Buttons />
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80%",
                  height: "100%",
                  zIndex: "99",
                  color: "white",
                  fontSize: "2rem",
                  wordWrap: "break-word",
                  margin: "0 auto",
                }}
              >
                <span
                  style={{
                    background: "#FF494A",
                    padding: "10px 25px",
                    borderRadius: "20px",
                  }}
                >
                  No contract found on this network!!!
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  if (activeTab == 3) {
    return (
      <div className="modal" style={{ top: "100px" }}>
        <div className="modal-content">
          {AAVEStakingAddress != null ? (
            <>
              <UnstakeLP />
              <Buttons />
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80%",
                  height: "100%",
                  zIndex: "99",
                  color: "white",
                  fontSize: "2rem",
                  wordWrap: "break-word",
                  margin: "0 auto",
                }}
              >
                <span
                  style={{
                    background: "#FF494A",
                    padding: "10px 25px",
                    borderRadius: "20px",
                  }}
                >
                  No contract found on this network!!!
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};
