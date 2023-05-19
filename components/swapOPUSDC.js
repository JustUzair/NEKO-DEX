import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
const explorerAddress = `https://mumbai.polygonscan.com/address/`;
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";

export function OPUSDCSwap() {
  const [slot1Symbol, setSlot1Symbol] = useState("WMATIC");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [slot2Icon, setSlot2Icon] = useState(
    "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png"
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
            🔀 Swap WMATIC for USDC or <br /> USDC for WMATIC.
          </div>
        </div>
      </div>
    </>
  );
}

export function OPUSDCDeposit() {
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

        <input className="asset" type="number" />

        <button className="swapButton"> Deposit </button>
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

export function OPUSDCWithdraw() {
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
          </table>
          <h4> Currency reserves </h4>
          <table>
            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                WMATIC
              </td>
              <td style={{ paddingLeft: 0 }} align="right">
                -
              </td>
            </tr>

            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                USDC
              </td>
              <td style={{ paddingLeft: 0 }} align="right">
                -
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

export const OPUSDCMODAL = () => {
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
        {activeTab === 1 && <OPUSDCSwap />}
        {activeTab === 2 && <OPUSDCDeposit />}
        {activeTab === 3 && <OPUSDCWithdraw />}

        <PoolData />
      </div>
    </div>
  );
};
