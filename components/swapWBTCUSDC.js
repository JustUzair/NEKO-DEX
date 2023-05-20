import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import ierc20Abi from "../constants/ierc20Abi.json";
import { BigNumber, ethers } from "ethers";
import DEXAbi from "../constants/DEXAbi.json";

const explorerAddress = `https://mumbai.polygonscan.com/address/`;
export function WBTCUSDCSwap() {
  const [slot1Symbol, setSlot1Symbol] = useState("WBTC");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [firstSlotInput, setFirstSlotInput] = useState(0);
  const [secondSlotOutput, setSecondSlotOutput] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false);

  const [slot2Icon, setSlot2Icon] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
  );
  const [slot1Icon, setSlot1Icon] = useState(
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  );
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WBTCPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTCPool"][
          contractAddresses[chainId]["WBTCPool"].length - 1
        ]
      : null;
  const WBTCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
        ]
      : null;

  const getBasedAssetPrice = async amount => {
    // alert(slot1Symbol);
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: DEXAbi,
          contractAddress: WBTCPoolContractAddress,
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

        <button className="swapButton"> Swap </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            🔀 Swap WBTC for USDC or <br /> USDC for WBTC.
          </div>
        </div>
      </div>
    </>
  );
}

export function WBTCUSDCDeposit() {
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

        <input className="asset" type="number" />
        <div className="selectAsset1">
          WBTC
          <img
            className="tokenIcon"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
          />
        </div>
        <div className="selectAsset2">
          USDC
          <img
            className="tokenIcon"
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
          />
        </div>

        <input className="asset" type="number" />

        <button className="swapButton"> Deposit </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            ✨ Deposit WBTC and USDC to <br /> to produce trading fees, <br />{" "}
            which are donated.
          </div>
        </div>
      </div>
    </>
  );
}

export function WBTCUSDCWithdraw() {
  return (
    <>
      <div className="swapBox">
        <div style={{ marginTop: 8, marginLeft: 10, marginBottom: 10 }}>
          {" "}
          Withdraw{" "}
        </div>

        <input className="asset" type="number" />
        <div className="selectAsset1">LP Tokens</div>

        <button className="swapButton"> Withdraw </button>
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
  const [WBTCReserve, setWBTCReserve] = useState(0);
  const [USDCReserve, setUSDCReserve] = useState(0);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const WBTCPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTCPool"][
          contractAddresses[chainId]["WBTCPool"].length - 1
        ]
      : null;
  const WBTCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
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
          contractAddress: WBTCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: WBTCPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const wbtc = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setWBTCReserve(wbtc);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: WBTCPoolContractAddress },
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
                  {WBTCPoolContractAddress ? (
                    <a
                      href={`${explorerAddress}${WBTCPoolContractAddress}`}
                      target="_blank"
                    >
                      {WBTCPoolContractAddress.substr(0, 4) +
                        "..." +
                        WBTCPoolContractAddress.substr(-4)}
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
                  {WBTCTestTokenContractAddress ? (
                    <a
                      href={`${explorerAddress}${WBTCTestTokenContractAddress}`}
                      target="_blank"
                    >
                      {WBTCTestTokenContractAddress.substr(0, 4) +
                        "..." +
                        WBTCTestTokenContractAddress.substr(-4)}
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
                  WBTC
                </td>
                <td style={{ paddingLeft: 0 }} align="right">
                  {WBTCReserve > 0
                    ? `~${parseFloat(WBTCReserve).toFixed(4)}`
                    : "-"}
                </td>
              </tr>

              <tr>
                <td style={{ paddingLeft: 0 }} align="left">
                  USDC
                </td>
                <td style={{ paddingLeft: 0 }} align="right">
                  {USDCReserve > 0
                    ? `~${parseFloat(USDCReserve).toFixed(4)}`
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

export const WBTCUSDCMODAL = () => {
  const [activeTab, setActiveTab] = useState(1);
  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="tab-container-2">
      <h2
        style={{
          color: "white",
          textShadow:
            "0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple",
        }}
      >
        {" "}
        WBTC Ube Pandasal{" "}
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
        {activeTab === 1 && <WBTCUSDCSwap />}
        {activeTab === 2 && <WBTCUSDCDeposit />}
        {activeTab === 3 && <WBTCUSDCWithdraw />}

        <PoolData />
      </div>
    </div>
  );
};
