import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
import ierc20Abi from "../constants/ierc20Abi.json";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import { BigNumber, ethers } from "ethers";
import { useNotification } from "web3uikit";
import DEXAbi from "../constants/DEXAbi.json";
const mumbaiExplorerAddress = `https://mumbai.polygonscan.com/address/`;
const okxExplorerAddress = `https://www.oklink.com/oktc-test/address/`;
const fantomExplorerAddress = `https://testnet.ftmscan.com/address/`;
export function WETHUSDCSwap({ setPoolView, setWETHUSDC }) {
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
  const [slot1Symbol, setSlot1Symbol] = useState("WETH");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [firstSlotInput, setFirstSlotInput] = useState(0);
  const [secondSlotOutput, setSecondSlotOutput] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false);
  const [slot2Icon, setSlot2Icon] = useState(
    "https://w7.pngwing.com/pngs/383/521/png-transparent-eth-crypto-cryptocurrency-cryptocurrencies-cash-money-bank-payment-icon.png"
  );
  const [slot1Icon, setSlot1Icon] = useState(
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  );

  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ETHPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const WETHTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
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
          contractAddress: ETHPoolContractAddress,
          functionName: "getOutputAmountWithFee",
          params: {
            inputAmount: await ethers.utils
              .parseUnits(
                amount.toString() || parseInt("0").toString(),
                "ether"
              )
              .toString(),
            isToken0: slot1Symbol === "USDC" ? true : false,
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
              : WETHTestTokenContractAddress,
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
          console.log("balance ", data.toString());
        },
      });
      if (!enoughBalance) return;
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress:
            slot1Symbol === "USDC"
              ? USDCTestTokenContractAddress
              : WETHTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: ETHPoolContractAddress,
            amount: ethers.utils.parseEther(firstSlotInput).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve", data);
          console.log(
            `First slot input in wei : `,
            ethers.utils.parseEther(firstSlotInput.toString()).toString()
          );
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
          contractAddress: ETHPoolContractAddress,
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
              (chainId == 137 && "Polygonscan") ||
              (chainId == 65 && "OKX Testnet Explorer") ||
              (chainId == 66 && "OKX Mainnet Explorer") ||
              (chainId == 250 && "Ftmscan Mainnet Explorer") ||
              (chainId == 4002 && "Ftmscan Testnet Explorer")
            } ) `
          );
          setPoolView(true);
          setWETHUSDC(false);
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
          onClick={() => {
            switchAssets();
          }}
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
            🔀 Swap WETH for USDC or <br /> USDC for WETH.
          </div>
        </div>
      </div>
    </>
  );
}

export function WETHUSDCDeposit({ setPoolView, setWETHUSDC }) {
  const [WETHDepositAmount, setWETHDepositAmount] = useState(0);
  const [USDCDepositAmount, setUSDCDepositAmount] = useState(0);
  const [nekoETHLPBalance, setNekoETHLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ETHPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const WETHTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
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
    if (WETHDepositAmount <= 0 || USDCDepositAmount <= 0) {
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
          contractAddress: WETHTestTokenContractAddress,
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
          console.log(value <= WETHDepositAmount);
          if (value <= WETHDepositAmount) {
            failureNotification("You do not have enough funds of WETH");
            return;
          }
          console.log("balance ether : ", data.toString());
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: WETHTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: ETHPoolContractAddress,
            amount: ethers.utils.parseEther(WETHDepositAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve weth", data);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: ETHPoolContractAddress,
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
          contractAddress: ETHPoolContractAddress,
          functionName: "addLiquidity",
          params: {
            token0Amount: ethers.utils.parseEther(USDCDepositAmount).toString(),
            token1Amount: ethers.utils.parseEther(WETHDepositAmount).toString(),
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
          setPoolView(true);
          setWETHUSDC(false);
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
          contractAddress: ETHPoolContractAddress,
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
          setNekoETHLPBalance(value);
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
            setWETHDepositAmount(e.target.value);
          }}
          value={WETHDepositAmount}
        />
        <div className="selectAsset1">
          WETH
          <img
            className="tokenIcon"
            src="https://w7.pngwing.com/pngs/383/521/png-transparent-eth-crypto-cryptocurrency-cryptocurrencies-cash-money-bank-payment-icon.png"
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
          title={nekoETHLPBalance}
        >
          Your Neko ETH LP Balance : ~{parseFloat(nekoETHLPBalance).toFixed(4)}
        </span>
        <button className="swapButton" onClick={addLiquidityToPool}>
          {" "}
          Deposit{" "}
        </button>
      </div>

      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            ✨ Deposit WETH and USDC to <br /> to produce trading fees, <br />{" "}
            which are donated.
          </div>
        </div>
      </div>
    </>
  );
}

export function WETHUSDCWithdraw({ setPoolView, setWETHUSDC }) {
  const [nekoETHLPWithdrawAmount, setNekoETHLPWithdrawAmount] = useState(0);
  const [nekoETHLPBalance, setNekoETHLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ETHPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const WETHTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
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
    if (nekoETHLPWithdrawAmount <= 0) {
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
          contractAddress: ETHPoolContractAddress,
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
          console.log(value < nekoETHLPWithdrawAmount);
          if (value < nekoETHLPWithdrawAmount) {
            failureNotification("You do not have enough funds of WETH LP");
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
          contractAddress: ETHPoolContractAddress,
          functionName: "approve",
          params: {
            spender: ETHPoolContractAddress,
            amount: ethers.utils.parseEther(nekoETHLPWithdrawAmount).toString(),
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
          contractAddress: ETHPoolContractAddress,
          functionName: "removeLiquidity",
          params: {
            liquidity: ethers.utils
              .parseEther(nekoETHLPWithdrawAmount)
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
              (chainId == 137 && "Polygonscan") ||
              (chainId == 65 && "OKX Testnet Explorer") ||
              (chainId == 66 && "OKX Mainnet Explorer") ||
              (chainId == 250 && "Ftmscan Mainnet Explorer") ||
              (chainId == 4002 && "Ftmscan Testnet Explorer")
            } ) `
          );
          setPoolView(true);
          setWETHUSDC(false);
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
          contractAddress: ETHPoolContractAddress,
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
          setNekoETHLPBalance(value);
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
            setNekoETHLPWithdrawAmount(e.target.value);
          }}
          value={nekoETHLPWithdrawAmount}
        ></input>
        <div className="selectAsset1">LP Tokens </div>

        <span
          style={{
            fontSize: "11.5px",
            marginLeft: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          title={nekoETHLPBalance}
        >
          ETH LP Balance : ~{parseFloat(nekoETHLPBalance).toFixed(2)}
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
          title={nekoETHLPBalance}
          onClick={e => {
            setNekoETHLPWithdrawAmount(nekoETHLPBalance);
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
            📤 Stop accumulating fees and <br /> claim your WETH and USDC.
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
  const [ETHReserve, setETHReserve] = useState(0);
  const [USDCReserve, setUSDCReserve] = useState(0);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ETHPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const WETHTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
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
          contractAddress: WETHTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: ETHPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const ether = ethers.utils.formatUnits(data.toString(), "ether");
          console.log(`ETHER : ${ether}`);
          setETHReserve(ether);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: ETHPoolContractAddress },
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
                <td style={{ paddingLeft: 0, fontWeight: "700" }} align="right">
                  {ETHPoolContractAddress ? (
                    <a
                      href={`${
                        (chainId == 80001 && mumbaiExplorerAddress) ||
                        (chainId == 65 && okxExplorerAddress) ||
                        (chainId == 4002 && fantomExplorerAddress)
                      }${ETHPoolContractAddress}`}
                      target="_blank"
                    >
                      {ETHPoolContractAddress.substr(0, 4) +
                        "..." +
                        ETHPoolContractAddress.substr(-4)}
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
                <td style={{ paddingLeft: 0, fontWeight: "700" }} align="right">
                  {WETHTestTokenContractAddress ? (
                    <a
                      href={`${
                        (chainId == 80001 && mumbaiExplorerAddress) ||
                        (chainId == 65 && okxExplorerAddress) ||
                        (chainId == 4002 && fantomExplorerAddress)
                      }${WETHTestTokenContractAddress}`}
                      target="_blank"
                    >
                      {WETHTestTokenContractAddress.substr(0, 4) +
                        "..." +
                        WETHTestTokenContractAddress.substr(-4)}
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
                  WETH
                </td>
                <td
                  style={{ paddingLeft: 0, fontWeight: "700" }}
                  align="right"
                  title={
                    ETHReserve > 0
                      ? `~${parseFloat(ETHReserve).toFixed(4)} WETH`
                      : "-"
                  }
                >
                  {ETHReserve > 0
                    ? `~${
                        parseFloat(ETHReserve).toFixed(4).toString().length > 13
                          ? parseFloat(ETHReserve)
                              .toFixed(4)
                              .toString()
                              .substring(0, 13) + "..."
                          : parseFloat(ETHReserve).toFixed(4)
                      }`
                    : "-"}
                </td>
              </tr>

              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  USDC
                </td>
                <td
                  style={{ paddingLeft: 0, fontWeight: "700" }}
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

export const WETHUSDCMODAL = ({ setPoolView, setWETHUSDC }) => {
  const [activeTab, setActiveTab] = useState(1);

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="tab-container-1">
      <h2
        style={{
          color: "white",
          textShadow:
            "0px 0px 10px brown, 0px 0px 10px brown, 0px 0px 10px brown, 0px 0px 10px brown, 0px 0px 10px brown, 0px 0px 10px brown",
        }}
      >
        {" "}
        Eth-Choco Chip Cookie Dough{" "}
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
          <WETHUSDCSwap setPoolView={setPoolView} setWETHUSDC={setWETHUSDC} />
        )}
        {activeTab === 2 && (
          <WETHUSDCDeposit
            setPoolView={setPoolView}
            setWETHUSDC={setWETHUSDC}
          />
        )}
        {activeTab === 3 && (
          <WETHUSDCWithdraw
            setPoolView={setPoolView}
            setWETHUSDC={setWETHUSDC}
          />
        )}

        <PoolData />
      </div>
    </div>
  );
};
