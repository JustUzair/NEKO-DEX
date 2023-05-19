import React, { useState, useEffect } from "react";
import Image from "next/image";
import contractAddresses from "../constants/networkMappings.json";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
const explorerAddress = `https://mumbai.polygonscan.com/address/`;
import ierc20Abi from "../constants/ierc20Abi.json";
import { BigNumber, ethers } from "ethers";

export function DAIUSDCSwap() {
  const [slot1Symbol, setSlot1Symbol] = useState("DAI");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [slot2Icon, setSlot2Icon] = useState(
    "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
  );
  const [slot1Icon, setSlot1Icon] = useState(
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  );

  function switchAssets() {
    const templink = slot1Icon;
    setSlot1Icon(slot2Icon);
    setSlot2Icon(templink);
    const tempAsset = slot1Symbol;
    setSlot1Symbol(slot2Symbol);
    setSlot2Symbol(tempAsset);
  }

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
        <input className="asset" type="number" />
        <div className="selectAsset1">
          {slot1Symbol}
          <img className="tokenIcon" src={slot2Icon} />
        </div>
        <div className="selectAsset2">
          {slot2Symbol}
          <img className="tokenIcon" src={slot1Icon} />
        </div>

        <input className="asset" type="number" />

        <button className="swapButton"> Swap </button>
      </div>
      <div className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            🔀 Swap DAI for USDC or <br /> USDC for DAI.
          </div>
        </div>
      </div>
    </>
  );
}

export function DAIUSDCDeposit() {
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
          DAI
          <img
            className="tokenIcon"
            src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
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
            ✨ Deposit DAI and USDC to <br /> to produce trading fees, <br />{" "}
            which are donated.
          </div>
        </div>
      </div>
    </>
  );
}

export function DAIUSDCWithdraw() {
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
            📤 Stop accumulating fees and <br /> claim your DAI and USDC.
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
  const [DAIReserve, setDAIReserve] = useState(0);
  const [USDCReserve, setUSDCReserve] = useState(0);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const DAIPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAIPool"][
          contractAddresses[chainId]["DAIPool"].length - 1
        ]
      : null;
  const DAITestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAI"][
          contractAddresses[chainId]["DAI"].length - 1
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
          contractAddress: DAITestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: DAIPoolContractAddress },
        },
        onError: error => {
          console.error(error);
        },
        onSuccess: data => {
          const ether = ethers.utils.formatUnits(data.toString(), "ether");
          //   console.log(`ETHER : ${ether}`);
          setDAIReserve(ether);
        },
      });
      await runContractFunction({
        params: {
          abi: ierc20Abi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "balanceOf",
          params: { account: DAIPoolContractAddress },
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
            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                Pool
              </td>
              <td style={{ paddingLeft: 0 }} align="right">
                {DAIPoolContractAddress ? (
                  <a
                    href={`${explorerAddress}${DAIPoolContractAddress}`}
                    target="_blank"
                  >
                    {DAIPoolContractAddress.substr(0, 4) +
                      "..." +
                      DAIPoolContractAddress.substr(-4)}
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
                {DAITestTokenContractAddress ? (
                  <a
                    href={`${explorerAddress}${DAITestTokenContractAddress}`}
                    target="_blank"
                  >
                    {DAITestTokenContractAddress.substr(0, 4) +
                      "..." +
                      DAITestTokenContractAddress.substr(-4)}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          </table>
          <h4> Currency reserves </h4>
          <table>
            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                DAI
              </td>
              <td style={{ paddingLeft: 0 }} align="right">
                {DAIReserve > 0 ? `~${parseFloat(DAIReserve).toFixed(4)}` : "-"}
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
          </table>
        </div>
      </div>
    </>
  );
}

export const DAIUSDCMODAL = () => {
  const [activeTab, setActiveTab] = useState(1);
  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="tab-container-4">
      <h2
        style={{
          color: "white",
          textShadow:
            "0px 0px 10px brown, 0px 0px 10px orange, 0px 0px 10px orange, 0px 0px 10px orange, 0px 0px 10px orange, 0px 0px 10px orange",
        }}
      >
        {" "}
        Stablecoin Strudel{" "}
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
        {activeTab === 1 && <DAIUSDCSwap />}
        {activeTab === 2 && <DAIUSDCDeposit />}
        {activeTab === 3 && <DAIUSDCWithdraw />}

        <PoolData />
      </div>
    </div>
  );
};
