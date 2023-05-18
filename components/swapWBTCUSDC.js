import React, { useState, useEffect } from "react";

export function WBTCUSDCSwap() {
  const [slot1Symbol, setSlot1Symbol] = useState("WBTC");
  const [slot2Symbol, setSlot2Symbol] = useState("USDC");
  const [slot2Icon, setSlot2Icon] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
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
      🔀 Swap WBTC for USDC or <br/> USDC for WBTC.
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
        ✨ Deposit WBTC and USDC to <br/> to produce trading fees, <br/> which are donated.
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
        📤 Stop accumulating fees and <br/> claim your WETH and USDC.
      </div>
      </div>
      </div>
    </>
  );
}

export function PoolData() {
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
                -
              </td>
            </tr>

            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                Token
              </td>
              <td style={{ paddingLeft: 0 }} align="right">
                -
              </td>
            </tr>
          </table>
          <h4> Currency reserves </h4>
          <table>
            <tr>
              <td style={{ paddingLeft: 0 }} align="left">
                WBTC
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

export const WBTCUSDCMODAL = () => {
  const [activeTab, setActiveTab] = useState(1);
  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="tab-container-2">
      <h2
      style={{color:"white", textShadow: "0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple, 0px 0px 10px purple"}}> WBTC Ube Pandasal </h2>
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
