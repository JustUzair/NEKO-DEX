import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
const explorerAddress = `https://mumbai.polygonscan.com/address/`;
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import ierc20Abi from "../constants/ierc20Abi.json";
import { BigNumber, ethers } from "ethers";
import DEXAbi from "../constants/DEXAbi.json";
import { useNotification } from "web3uikit";

export function OPUSDCSwap({ setPoolView, setOPUSDC }) {
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
  const [slot1Symbol, setSlot1Symbol] = useState("WMATIC");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [firstSlotInput, setFirstSlotInput] = useState(0);
  const [secondSlotOutput, setSecondSlotOutput] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false);

  const [slot2Icon, setSlot2Icon] = useState(
    "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png"
  );
  const [slot1Icon, setSlot1Icon] = useState(
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  );
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WMATICPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATICPool"][
          contractAddresses[chainId]["WMATICPool"].length - 1
        ]
      : null;
  const WMATICTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATIC"][
          contractAddresses[chainId]["WMATIC"].length - 1
        ]
      : null;
  const USDCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const getBasedAssetPrice = async amount => {
    // alert(slot1Symbol);
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: DEXAbi,
          contractAddress: WMATICPoolContractAddress,
          functionName: "getOutputAmountWithFee",
          params: {
            inputAmount: await ethers.utils
              .parseUnits(
                amount.toString() || parseInt("0").toString(),
                "ether"
              )
              .toString(),
            isToken0: slot1Symbol == "USDC" ? true : false,
          },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          //   console.log(data);
          const value = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setSecondSlotOutput(parseFloat(value).toFixed(4));
        },
      });
    }
  };
  const swapAssets = async () => {
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      let enoughBalance = false;

      //   console.log(
      //     `${slot1Symbol} Address ${
      //       slot1Symbol == "USDC"
      //         ? USDCTestTokenContractAddress
      //         : W
      //     }`
      //   );
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress:
            slot1Symbol === "USDC"
              ? USDCTestTokenContractAddress
              : WMATICTestTokenContractAddress,
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
          //   console.log(data);
          //   console.log(
          //     `FUNDS : ${ethers.utils.formatUnits(data.toString(), "ether")}`
          //   );
          const value = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          console.log(value <= firstSlotInput);
          if (value <= firstSlotInput) {
            failureNotification("You do not have enough funds of Asset 1");
            return;
          }
          enoughBalance = true;

          //   console.log("balance ", data.toString());
        },
      });
      if (!enoughBalance) return;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress:
            slot1Symbol === "USDC"
              ? USDCTestTokenContractAddress
              : WMATICTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: WMATICPoolContractAddress,
            amount: ethers.utils.parseEther(firstSlotInput).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve", data);
          //   console.log(
          //     `First slot input in wei : `,
          //     ethers.utils.parseEther(firstSlotInput.toString()).toString()
          //   );
        },
      });
      //   console.log(
      //     `TOKEN 0 : `,
      //     ethers.utils.parseEther(firstSlotInput).toString()
      //   );
      //   console.log(
      //     `TOKEN 1 : `,
      //     ethers.utils.parseEther(secondSlotOutput).toString()
      //   );
      //   console.log(Math.floor(secondSlotOutput).toString());
      await runContractFunction({
        params: {
          abi: DEXAbi,
          contractAddress: WMATICPoolContractAddress,
          functionName: "swap",
          params:
            slot1Symbol === "USDC"
              ? {
                  token0In: ethers.utils.parseEther(firstSlotInput).toString(),
                  token1In: 0,
                  token0OutMin: 0,
                  token1OutMin: 0,
                }
              : {
                  token0In: 0,
                  token1In: ethers.utils.parseEther(firstSlotInput).toString(),
                  token0OutMin: 0,
                  token1OutMin: 0,
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
          setPoolView(true);
          setOPUSDC(false);
          await data.wait(1);
          successNotification(`Assets swapped `);
          setFirstSlotInput(0);
        },
      });
    }
  };
  function switchAssets() {
    const templink = slot1Icon;
    setSlot1Icon(slot2Icon);
    setSlot2Icon(templink);
    const tempAsset = slot1Symbol;
    setSlot1Symbol(slot2Symbol);
    setSlot2Symbol(tempAsset);
    setIsSwapped(!isSwapped);
  }
  useEffect(() => {
    getBasedAssetPrice(firstSlotInput);
  }, [isSwapped, firstSlotInput]);
  return (
    <>
      <h1
        style={{
          textAlign: "center",
        }}
      ></h1>

      <div className="swapBox">
        <div style={{ marginTop: 8, marginLeft: 10, marginBottom: 10 }}>
          {" "}
          Swap{" "}
        </div>
        <img
          src="https://i.ibb.co/B431MDW/sort.png"
          className="switchAssets"
          onClick={() => switchAssets()}
        />
        <input
          className="asset"
          type="number"
          onChange={e => {
            setFirstSlotInput(e.target.value);
            getBasedAssetPrice(e.target.value);
          }}
          value={firstSlotInput}
        />
        <div className="selectAsset1">
          {slot1Symbol}
          <img className="tokenIcon" src={slot2Icon} />
        </div>
        <div className="selectAsset2">
          {slot2Symbol}
          <img className="tokenIcon" src={slot1Icon} />
        </div>

        <input
          className="asset"
          type="number"
          value={secondSlotOutput}
          readOnly={true}
        />

        <button className="swapButton" onClick={swapAssets}>
          {" "}
          Swap{" "}
        </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            🔀 Swap WMATIC for USDC or <br /> USDC for WMATIC.
          </div>
        </div>
      </div>
    </>
  );
}

export function OPUSDCDeposit({ setPoolView, setOPUSDC }) {
  const [WMATICDepositAmount, setWMATICDepositAmount] = useState(0);
  const [USDCDepositAmount, setUSDCDepositAmount] = useState(0);
  const [nekoWMATICLPBalance, setNekoWMATICLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WMATICPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATICPool"][
          contractAddresses[chainId]["WMATICPool"].length - 1
        ]
      : null;
  const WMATICTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATIC"][
          contractAddresses[chainId]["WMATIC"].length - 1
        ]
      : null;
  const USDCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
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
  const addLiquidityToPool = async () => {
    if (WMATICDepositAmount <= 0 || USDCDepositAmount <= 0) {
      failureNotification(
        "Values of both the assets should be greater than 0!!"
      );
      return;
    }
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
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
          console.log(value <= USDCDepositAmount);
          if (value <= USDCDepositAmount) {
            failureNotification("You do not have enough funds of USDC");
            return;
          }
          console.log("balance usdc : ", data.toString());
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: WMATICTestTokenContractAddress,
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
          console.log(value <= WMATICDepositAmount);
          if (value <= WMATICDepositAmount) {
            failureNotification("You do not have enough funds of WMATIC");
            return;
          }
          console.log("balance ether : ", data.toString());
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: WMATICTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: WMATICPoolContractAddress,
            amount: ethers.utils.parseEther(WMATICDepositAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve wmatic", data);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: WMATICPoolContractAddress,
            amount: ethers.utils.parseEther(USDCDepositAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve usdc", data);
        },
      });

      await runContractFunction({
        params: {
          abi: DEXAbi,
          contractAddress: WMATICPoolContractAddress,
          functionName: "addLiquidity",
          params: {
            token0Amount: ethers.utils.parseEther(USDCDepositAmount).toString(),
            token1Amount: ethers.utils
              .parseEther(WMATICDepositAmount)
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
          setPoolView(true);
          setOPUSDC(false);
          await data.wait(1);
          successNotification(`Assets Deposited `);
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
          contractAddress: WMATICPoolContractAddress,
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
          setNekoWMATICLPBalance(value);
        },
      });
    }
  };

  useEffect(() => {
    getDEXLPBalanceOfUser();
  }, [account]);
  return (
    <>
      <h1
        style={{
          textAlign: "center",
        }}
      ></h1>

      <div className="swapBox">
        <div style={{ marginTop: 8, marginLeft: 10, marginBottom: 10 }}>
          {" "}
          Deposit{" "}
        </div>

        <input
          className="asset"
          type="number"
          onChange={e => {
            setWMATICDepositAmount(e.target.value);
          }}
          value={WMATICDepositAmount}
        />
        <div className="selectAsset1">
          WMATIC
          <img
            className="tokenIcon"
            src="https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png"
          />
        </div>
        <div className="selectAsset2">
          USDC
          <img
            className="tokenIcon"
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
          />
        </div>

        <input
          className="asset"
          type="number"
          onChange={e => {
            setUSDCDepositAmount(e.target.value);
          }}
          value={USDCDepositAmount}
        />
        <span
          style={{
            fontSize: "11.5px",
            marginLeft: "10px",
            fontWeight: "600",
          }}
          title={nekoWMATICLPBalance}
        >
          Your Neko MATIC LP Balance : ~
          {parseFloat(nekoWMATICLPBalance).toFixed(4)}
        </span>
        <button className="swapButton" onClick={addLiquidityToPool}>
          {" "}
          Deposit{" "}
        </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            ✨ Deposit WMATIC and USDC to <br /> to produce trading fees, <br />{" "}
            which are donated.
          </div>
        </div>
      </div>
    </>
  );
}

export function OPUSDCWithdraw({ setPoolView, setOPUSDC }) {
  const [nekoWMATICLPWithdrawAmount, setNekoWMATICLPWithdrawAmount] =
    useState(0);
  const [nekoWMATICLPBalance, setNekoWMATICLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WMATICPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATICPool"][
          contractAddresses[chainId]["WMATICPool"].length - 1
        ]
      : null;
  const WMATICTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATIC"][
          contractAddresses[chainId]["WMATIC"].length - 1
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
  const withdrawLiquidityFromPool = async () => {
    if (nekoWMATICLPWithdrawAmount <= 0) {
      failureNotification(
        "Values of the lp tokens to withdraw should be greater than 0!!"
      );
      return;
    }
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      let enoughLiquidity = false;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: WMATICPoolContractAddress,
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
          console.log(value < nekoWMATICLPWithdrawAmount);
          if (value < nekoWMATICLPWithdrawAmount) {
            failureNotification("You do not have enough funds of WMATIC LP");
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
          contractAddress: WMATICPoolContractAddress,
          functionName: "approve",
          params: {
            spender: WMATICPoolContractAddress,
            amount: ethers.utils
              .parseEther(nekoWMATICLPWithdrawAmount)
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
          abi: DEXAbi,
          contractAddress: WMATICPoolContractAddress,
          functionName: "removeLiquidity",
          params: {
            liquidity: ethers.utils
              .parseEther(nekoWMATICLPWithdrawAmount)
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
          setPoolView(true);
          setOPUSDC(false);
          await data.wait(1);
          successNotification(`Assets Withdrawn `);
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
          contractAddress: WMATICPoolContractAddress,
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
          setNekoWMATICLPBalance(value);
        },
      });
    }
  };

  useEffect(() => {
    getDEXLPBalanceOfUser();
  }, [account]);
  return (
    <>
      <div className="swapBox">
        <div style={{ marginTop: 8, marginLeft: 10, marginBottom: 10 }}>
          {" "}
          Withdraw{" "}
        </div>

        <input
          className="asset"
          type="number"
          onChange={e => {
            setNekoWMATICLPWithdrawAmount(e.target.value);
          }}
          value={nekoWMATICLPWithdrawAmount}
        />
        <div className="selectAsset1">LP Tokens</div>
        <span
          style={{
            fontSize: "11.5px",
            marginLeft: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          title={nekoWMATICLPBalance}
        >
          ETH LP Balance : ~{parseFloat(nekoWMATICLPBalance).toFixed(2)}
        </span>

        <span
          style={{
            fontSize: "11.5px",
            marginLeft: "10px",
            fontWeight: "600",
            cursor: "pointer",
            background: "blueviolet",
            padding: "3px 5px",
            borderRadius: "4px",
            color: "white",
          }}
          title={nekoWMATICLPBalance}
          onClick={e => {
            setNekoWMATICLPWithdrawAmount(nekoWMATICLPBalance);
          }}
        >
          Withdraw All ?
        </span>
        <button className="swapButton" onClick={withdrawLiquidityFromPool}>
          {" "}
          Withdraw{" "}
        </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            📤 Stop accumulating fees and <br /> claim your WMATIC and USDC.
          </div>
        </div>
      </div>
    </>
  );
}

export function PoolData() {
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const [WMATICReserve, setWMATICReserve] = useState(0);
  const [USDCReserve, setUSDCReserve] = useState(0);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WMATICPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATICPool"][
          contractAddresses[chainId]["WMATICPool"].length - 1
        ]
      : null;
  const WMATICTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATIC"][
          contractAddresses[chainId]["WMATIC"].length - 1
        ]
      : null;
  const USDCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const getTokenBalances = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: WMATICTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: WMATICPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const matic = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setWMATICReserve(matic);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: WMATICPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const usdc = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setUSDCReserve(usdc);
        },
      });
    }
  };
  useEffect(() => {
    getTokenBalances();
  }, [account]);
  return (
    <>
      <div className="swapBox" style={{ height: 300 }}>
        <div style={{ marginTop: 8, marginLeft: 10, marginBottom: 10 }}>
          <h4> Contracts </h4>
          <table>
            <tbody>
              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  Pool
                </td>
                <td style={{ paddingLeft: 0 }} align="right">
                  {WMATICPoolContractAddress ? (
                    <a
                      href={`${explorerAddress}${WMATICPoolContractAddress}`}
                      target="_blank"
                    >
                      {WMATICPoolContractAddress.substr(0, 4) +
                        "..." +
                        WMATICPoolContractAddress.substr(-4)}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>

              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  Token
                </td>
                <td style={{ paddingLeft: 0 }} align="right">
                  {WMATICTestTokenContractAddress ? (
                    <a
                      href={`${explorerAddress}${WMATICTestTokenContractAddress}`}
                      target="_blank"
                    >
                      {WMATICTestTokenContractAddress.substr(0, 4) +
                        "..." +
                        WMATICTestTokenContractAddress.substr(-4)}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <h4> Currency reserves </h4>
          <table>
            <tbody>
              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  WMATIC
                </td>
                <td
                  style={{ paddingLeft: 0 }}
                  align="right"
                  title={
                    WMATICReserve > 0
                      ? `~${parseFloat(WMATICReserve).toFixed(4)} WMATIC`
                      : "-"
                  }
                >
                  {WMATICReserve > 0
                    ? `~${
                        parseFloat(WMATICReserve).toFixed(4).toString().length >
                        13
                          ? parseFloat(WMATICReserve)
                              .toFixed(4)
                              .toString()
                              .substring(0, 13) + "..."
                          : parseFloat(WMATICReserve).toFixed(4)
                      }`
                    : "-"}
                </td>
              </tr>

              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  USDC
                </td>
                <td
                  style={{ paddingLeft: 0 }}
                  align="right"
                  title={
                    USDCReserve > 0
                      ? `~${parseFloat(USDCReserve).toFixed(4)} USDC`
                      : "-"
                  }
                >
                  {USDCReserve > 0
                    ? `~${
                        parseFloat(USDCReserve).toFixed(4).toString().length >
                        13
                          ? parseFloat(USDCReserve)
                              .toFixed(4)
                              .toString()
                              .substring(0, 13) + "..."
                          : parseFloat(USDCReserve).toFixed(4)
                      }`
                    : "-"}
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  USD total
                </td>
                <td style={{ paddingLeft: 0 }} align="right">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const OPUSDCMODAL = ({ setPoolView, setOPUSDC }) => {
  const [activeTab, setActiveTab] = useState(1);
  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="tab-container-3">
      <h2
        style={{
          color: "white",
          textShadow:
            "0px 0px 10px brown, 0px 0px 10px green, 0px 0px 10px green, 0px 0px 10px green, 0px 0px 10px green, 0px 0px 10px green",
        }}
      >
        {" "}
        Matic Melt{" "}
      </h2>
      <div className="tab-buttons">
        <button
          style={{}}
          className={activeTab === 1 ? "active" : "inactive"}
          onClick={() => handleTabClick(1)}
        >
          Swap
        </button>
        <button
          className={activeTab === 2 ? "active" : "inactive"}
          onClick={() => handleTabClick(2)}
        >
          Deposit
        </button>
        <button
          className={activeTab === 3 ? "active" : "inactive"}
          onClick={() => handleTabClick(3)}
        >
          Withdraw
        </button>
      </div>
      <br />
      <div className="tab-content">
        {activeTab === 1 && (
          <OPUSDCSwap setPoolView={setPoolView} setOPUSDC={setOPUSDC} />
        )}
        {activeTab === 2 && (
          <OPUSDCDeposit setPoolView={setPoolView} setOPUSDC={setOPUSDC} />
        )}
        {activeTab === 3 && (
          <OPUSDCWithdraw setPoolView={setPoolView} setOPUSDC={setOPUSDC} />
        )}

        <PoolData />
      </div>
    </div>
  );
};
