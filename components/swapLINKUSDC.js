import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import ierc20Abi from "../constants/ierc20Abi.json";
import { BigNumber, ethers } from "ethers";
import DEXAbi from "../constants/DEXAbi.json";
import { useNotification } from "web3uikit";

const mumbaiExplorerAddress = `https://mumbai.polygonscan.com/address/`;
const okxExplorerAddress = `https://www.oklink.com/oktc-test/address/`;
const fantomExplorerAddress = `https://testnet.ftmscan.com/address/`;
const fantomMainnetExplorerAddress = `https://ftmscan.com/address/`;

export function LINKUSDCSwap({ setPoolView, setLINKUSDC }) {
  const dispatch = useNotification();

  const [slot1Symbol, setSlot1Symbol] = useState("LINK");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [firstSlotInput, setFirstSlotInput] = useState(0);
  const [secondSlotOutput, setSecondSlotOutput] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false);

  const [slot2Icon, setSlot2Icon] = useState(
    "https://s2.coinmarketcap.com/static/img/coins/200x200/1975.png"
  );
  const [slot1Icon, setSlot1Icon] = useState(
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  );

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
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LINKPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINKPool"][
          contractAddresses[chainId]["LINKPool"].length - 1
        ]
      : null;
  const LINKTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
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
          contractAddress: LINKPoolContractAddress,
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
              : LINKTestTokenContractAddress,
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
              : LINKTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: LINKPoolContractAddress,
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
      console.log(
        `TOKEN 0 : `,
        ethers.utils.parseEther(firstSlotInput).toString()
      );
      console.log(
        `TOKEN 1 : `,
        ethers.utils.parseEther(secondSlotOutput).toString()
      );
      //   console.log(Math.floor(secondSlotOutput).toString());
      await runContractFunction({
        params: {
          abi: DEXAbi,
          contractAddress: LINKPoolContractAddress,
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
          setLINKUSDC(false);
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
            🔀 Swap LINK for USDC or <br /> USDC for LINK.
          </div>
        </div>
      </div>
    </>
  );
}

export function LINKUSDCDeposit({ setPoolView, setLINKUSDC }) {
  const [LINKDepositAmount, setLINKDepositAmount] = useState(0);
  const [USDCDepositAmount, setUSDCDepositAmount] = useState(0);
  const [nekoLINKLPBalance, setNekoLINKLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LINKPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINKPool"][
          contractAddresses[chainId]["LINKPool"].length - 1
        ]
      : null;
  const LINKTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
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
    if (LINKDepositAmount <= 0 || USDCDepositAmount <= 0) {
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
          contractAddress: LINKTestTokenContractAddress,
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
          console.log(value <= LINKDepositAmount);
          if (value <= LINKDepositAmount) {
            failureNotification("You do not have enough funds of LINK");
            return;
          }
          console.log("balance ether : ", data.toString());
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: LINKTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: LINKPoolContractAddress,
            amount: ethers.utils.parseEther(LINKDepositAmount).toString(),
          },
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: data => {
          console.log("approve LINK", data);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "approve",
          params: {
            spender: LINKPoolContractAddress,
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
          contractAddress: LINKPoolContractAddress,
          functionName: "addLiquidity",
          params: {
            token0Amount: ethers.utils.parseEther(USDCDepositAmount).toString(),
            token1Amount: ethers.utils.parseEther(LINKDepositAmount).toString(),
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
          setLINKUSDC(false);
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
          contractAddress: LINKPoolContractAddress,
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
          setNekoLINKLPBalance(value);
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
            setLINKDepositAmount(e.target.value);
          }}
          value={LINKDepositAmount}
        />
        <div className="selectAsset1">
          LINK
          <img
            className="tokenIcon"
            src="https://s2.coinmarketcap.com/static/img/coins/200x200/1975.png"
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
          title={nekoLINKLPBalance}
        >
          Your Neko LINK LP Balance : ~
          {parseFloat(nekoLINKLPBalance).toFixed(4)}
        </span>
        <button className="swapButton" onClick={addLiquidityToPool}>
          {" "}
          Deposit{" "}
        </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            ✨ Deposit LINK and USDC to <br /> to produce trading fees, <br />{" "}
            which are donated.
          </div>
        </div>
      </div>
    </>
  );
}

export function LINKUSDCWithdraw({ setPoolView, setLINKUSDC }) {
  const [nekoBTCLPWithdrawAmount, setNekoBTCLPWithdrawAmount] = useState(0);
  const [nekoBTCLPBalance, setNekoBTCLPBalance] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LINKPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINKPool"][
          contractAddresses[chainId]["LINKPool"].length - 1
        ]
      : null;
  const LINKTestTokenContractAddress =
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
  const withdrawLiquidityFromPool = async () => {
    if (nekoBTCLPWithdrawAmount <= 0) {
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
          contractAddress: LINKPoolContractAddress,
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
          console.log(value < nekoBTCLPWithdrawAmount);
          if (value < nekoBTCLPWithdrawAmount) {
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
          contractAddress: LINKPoolContractAddress,
          functionName: "approve",
          params: {
            spender: LINKPoolContractAddress,
            amount: ethers.utils.parseEther(nekoBTCLPWithdrawAmount).toString(),
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
          contractAddress: LINKPoolContractAddress,
          functionName: "removeLiquidity",
          params: {
            liquidity: ethers.utils
              .parseEther(nekoBTCLPWithdrawAmount)
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
          setLINKUSDC(false);
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
          contractAddress: LINKPoolContractAddress,
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
          setNekoBTCLPBalance(value);
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
            setNekoBTCLPWithdrawAmount(e.target.value);
          }}
          value={nekoBTCLPWithdrawAmount}
        />

        <div className="selectAsset1">LP Tokens</div>
        <span
          style={{
            fontSize: "11.5px",
            marginLeft: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          title={nekoBTCLPBalance}
        >
          LINK LP Balance : ~{parseFloat(nekoBTCLPBalance).toFixed(2)}
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
          title={nekoBTCLPBalance}
          onClick={e => {
            setNekoBTCLPWithdrawAmount(nekoBTCLPBalance);
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
            📤 Stop accumulating fees and <br /> claim your LINK and USDC.
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
  const [LINKReserve, setLINKReserve] = useState(0);
  const [USDCReserve, setUSDCReserve] = useState(0);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LINKPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINKPool"][
          contractAddresses[chainId]["LINKPool"].length - 1
        ]
      : null;
  const LINKTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
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
          contractAddress: LINKTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: LINKPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const LINK = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setLINKReserve(LINK);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: LINKPoolContractAddress },
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
                  {LINKPoolContractAddress ? (
                    <a
                      href={`${
                        (chainId == 80001 && mumbaiExplorerAddress) ||
                        (chainId == 65 && okxExplorerAddress) ||
                        (chainId == 4002 && fantomExplorerAddress) ||
                        (chainId == 250 && fantomMainnetExplorerAddress)
                      }${LINKPoolContractAddress}`}
                      target="_blank"
                    >
                      {LINKPoolContractAddress.substr(0, 4) +
                        "..." +
                        LINKPoolContractAddress.substr(-4)}
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
                  {LINKTestTokenContractAddress ? (
                    <a
                      href={`${
                        (chainId == 80001 && mumbaiExplorerAddress) ||
                        (chainId == 65 && okxExplorerAddress) ||
                        (chainId == 4002 && fantomExplorerAddress) ||
                        (chainId == 250 && fantomMainnetExplorerAddress)
                      }${LINKTestTokenContractAddress}`}
                      target="_blank"
                    >
                      {LINKTestTokenContractAddress.substr(0, 4) +
                        "..." +
                        LINKTestTokenContractAddress.substr(-4)}
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
                  LINK
                </td>
                <td
                  style={{ paddingLeft: 0 }}
                  align="right"
                  title={`~${parseFloat(LINKReserve).toFixed(4)} LINK`}
                >
                  {LINKReserve > 0
                    ? `~${
                        parseFloat(LINKReserve).toFixed(4).toString().length >
                        13
                          ? parseFloat(LINKReserve)
                              .toFixed(4)
                              .toString()
                              .substring(0, 13) + "..."
                          : parseFloat(LINKReserve).toFixed(4)
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
                  title={`~${parseFloat(USDCReserve).toFixed(4)} USDC`}
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

export const LINKUSDCMODAL = ({ setPoolView, setLINKUSDC }) => {
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
            "0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple",
        }}
      >
        {" "}
        Link Layer Cake{" "}
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
          <LINKUSDCSwap setPoolView={setPoolView} setLINKUSDC={setLINKUSDC} />
        )}
        {activeTab === 2 && (
          <LINKUSDCDeposit
            setPoolView={setPoolView}
            setLINKUSDC={setLINKUSDC}
          />
        )}
        {activeTab === 3 && (
          <LINKUSDCWithdraw
            setPoolView={setPoolView}
            setLINKUSDC={setLINKUSDC}
          />
        )}

        <PoolData />
      </div>
    </div>
  );
};
