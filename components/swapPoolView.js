import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import { WETHUSDCMODAL } from "./swapWETHUSDC.js";
import { WBTCUSDCMODAL } from "./swapWBTCUSDC.js";
import { OPUSDCMODAL } from "./swapOPUSDC.js";
import { DAIUSDCMODAL } from "./swapDAIUSDC.js";
import contractAddresses from "../constants/networkMappings.json";
export default function SwapPoolView() {
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();

  useEffect(() => {
    if (!isWeb3Enabled) authenticate();
  }, [account]);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const isValidChain = chainId in contractAddresses;
  const ETHPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["ETHPool"][
          contractAddresses[chainId]["ETHPool"].length - 1
        ]
      : null;
  const WBTCPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTCPool"][
          contractAddresses[chainId]["WBTCPool"].length - 1
        ]
      : null;
  const WMATICPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATICPool"][
          contractAddresses[chainId]["WMATICPool"].length - 1
        ]
      : null;
  const DAIPoolContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAIPool"][
          contractAddresses[chainId]["DAIPool"].length - 1
        ]
      : null;
  const [WETHUSDC, setWETHUSDC] = useState(false);
  const [WBTCUSDC, setWBTCUSDC] = useState(false);
  const [OPUSDC, setOPUSDC] = useState(false);

  const [DAIUSDC, setDAIUSDC] = useState(false);
  const [poolview, setPoolView] = useState(true);

  const [showPoolInfo, setShowPoolInfo] = useState(true);

  function viewWETHUSDC() {
    setWETHUSDC(true);
    setPoolView(false);
    setShowPoolInfo(false);
  }

  function viewWBTCUSDC() {
    setWBTCUSDC(true);
    setPoolView(false);
    setShowPoolInfo(false);
  }

  function viewOPUSDC() {
    setOPUSDC(true);
    setPoolView(false);
    setShowPoolInfo(false);
  }

  function viewDAIUSDC() {
    setDAIUSDC(true);
    setPoolView(false);
    setShowPoolInfo(false);
  }

  function viewNone() {
    setWETHUSDC(false);
    setDAIUSDC(false);
    setOPUSDC(false);
    setWBTCUSDC(false);
    setPoolView(true);
    setShowPoolInfo(false);
  }

  return isValidChain ? (
    <>
      {" "}
      {poolview && (
        <div className="poolView">
          <h1 style={{ color: "white", textShadow: "4px 4px 4px black" }}>
            NEKO CAFE MENU
            <div
              style={{
                marginLeft: "50px",
                display: "inline-block",
                fontSize: "15px",
              }}
            >
              TVL : $15,403,431.20
            </div>
            {/* <div
              style={{
                display: "inline-block",
                fontSize: "12px",
                marginLeft: "100px",
              }}
            >
              0.03% of all swaps are donated ✨🐱‍🚀
            </div> */}
          </h1>

          <table style={{border:"none"}}>
            <tbody style={{border:"none"}}>
              <tr style={{ color: "white", textShadow: "4px 4px 4px black", border:"none"}}>
                <th>Pool</th>
                <th></th>
                <th>Volume</th>
                <th>TVL</th>
              </tr>
              {ETHPoolContractAddress != null ? (
                <tr onClick={() => viewWETHUSDC()} className="poolSection">
                  
                  <td>
                    {" "}
                    <div className="poolContent">
                      <img
                        className="tokenIcon"
                        src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png"
                      />
                      <img
                        className="tokenIcon"
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                      />{" "}
                      <div>
                        <b> Eth-Choco Chip Cookie Dough </b> <br />
                        WETH / USDC
                      </div>
                    </div>
                  </td>
                  <td >
                  <img src="https://i.ibb.co/7bmvCmD/image.png" className="poolPic"/>
                  </td>
                  <td>-</td>
                  <td>-</td>
           
                </tr>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "50%",
                      zIndex: "99",
                      color: "white",
                      fontSize: "1.2rem",
                      wordWrap: "break-word",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        background: "#FF494A",
                        padding: "10px 25px",
                        borderRadius: "8px",
                        margin: "10px 0",
                      }}
                    >
                      No DEX Pool found on this network!!!
                    </span>
                  </div>
                </>
              )}

              {WBTCPoolContractAddress ? (
                <tr onClick={() => viewWBTCUSDC(true)} className="poolSection2">
                  <td>
                    <div className="poolContent">
                      <img
                        className="tokenIcon"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                      />
                      <img
                        className="tokenIcon"
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                      />
                      <div>
                        <b> WBTC Ube Pandasal </b> <br />
                        WBTC / USDC
                      </div>
                    </div>
                  </td>
                  <td> <img src="https://i.ibb.co/dJx1s8f/image.png" className="poolPic"/></td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "50%",
                      zIndex: "99",
                      color: "white",
                      fontSize: "1.2rem",
                      wordWrap: "break-word",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        background: "#FF494A",
                        padding: "10px 25px",
                        borderRadius: "8px",
                        margin: "10px 0",
                      }}
                    >
                      No DEX Pool found on this network!!!
                    </span>
                  </div>
                </>
              )}
              {WMATICPoolContractAddress ? (
                <tr onClick={() => viewOPUSDC(true)} className="poolSection3">
                  <td>
                    <div className="poolContent">
                      <img
                        className="tokenIcon"
                        src="https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png"
                      />
                      <img
                        className="tokenIcon"
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                      />
                      <div>
                        <b> Matic Melt </b> <br />
                        WMATIC / USDC
                      </div>
                    </div>
                  </td>
                  <td><img src="https://i.ibb.co/ZSMSdWY/image.png" className="poolPic"></img></td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "50%",
                      zIndex: "99",
                      color: "white",
                      fontSize: "1.2rem",
                      wordWrap: "break-word",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        background: "#FF494A",
                        padding: "10px 25px",
                        borderRadius: "8px",
                        margin: "10px 0",
                      }}
                    >
                      No DEX Pool found on this network!!!
                    </span>
                  </div>
                </>
              )}
              {DAIPoolContractAddress ? (
                <tr className="poolSection4" onClick={() => viewDAIUSDC(true)}>
                  <td>
                    <div className="poolContent">
                      <img
                        className="tokenIcon"
                        src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
                      />
                      <img
                        className="tokenIcon"
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                      />
                      <div>
                        {" "}
                        <b> Stablecoin Strudel </b> <br />
                        DAI / USDC
                      </div>
                    </div>
                  </td>
                  <td> <img src="https://i.ibb.co/MnX5vJ0/image.png" className="poolPic"></img></td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "50%",
                      zIndex: "99",
                      color: "white",
                      fontSize: "1.2rem",
                      wordWrap: "break-word",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        background: "#FF494A",
                        padding: "10px 25px",
                        borderRadius: "8px",
                        margin: "10px 0",
                      }}
                    >
                      No DEX Pool found on this network!!!
                    </span>
                  </div>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {WETHUSDC && (
        <WETHUSDCMODAL setPoolView={setPoolView} setWETHUSDC={setWETHUSDC} />
      )}
      {WBTCUSDC && (
        <WBTCUSDCMODAL setPoolView={setPoolView} setWBTCUSDC={setWBTCUSDC} />
      )}
      {OPUSDC && (
        <OPUSDCMODAL setPoolView={setPoolView} setOPUSDC={setOPUSDC} />
      )}
      {DAIUSDC && (
        <DAIUSDCMODAL setPoolView={setPoolView} setDAIUSDC={setDAIUSDC} />
      )}
      {(WETHUSDC || WBTCUSDC || OPUSDC || DAIUSDC || WETHUSDC) && (
        <button className="modalButton" onClick={() => viewNone(false)}>
          Back
        </button>
      )}
         {showPoolInfo &&   <div style={{marginTop:"-450px",marginLeft:"500px"}} className="infoPanel">
        <div className="typedOutWrapperInfo">
          <div className="typedOutInfo">
            🔀 Swap tokens in any of our<br/> pools.
          </div>
        </div>
      </div>
}
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
  );
}
