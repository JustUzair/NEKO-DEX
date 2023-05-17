import React, { useEffect } from "react";
import Game from "../components/Game";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
export default function Home() {
  const [login, setLogin] = useState(false);
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled } = useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  useEffect(() => {
    enableWeb3();
  }, []);
  useEffect(() => {
    authenticate();
    // console.log(`Account : ${account}`);
    if (account != null) setLogin(true);
    else setLogin(false);
  }, [account]);
  const Login = () => {
    return (
      <div className="container">
        <div className="login">
          <span
            className="title-container"
            style={{
              marginTop: "25px",
            }}
          >
            <h1 className="dapp-title"> NEKO DEX Cafe </h1>
          </span>
          <div className="connect-button--container">
            <span
              style={{
                //   background: "rgba(232,63,121,1)",
                background: "linear-gradient(to right, #E84C3D, #FF4E3F)",
                padding: "0px 50px",
                color: "#fff",
                borderRadius: "15px",
                width: "fit-content",
                marginBottom: "25px",
              }}
            >
              Please connect your wallet to continue
            </span>

            <div
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  margin: "0 auto",
                  width: "145px",
                }}
              >
                <ConnectButton
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //   if (account) return ;
  //   else return ;
  return <>{login ? <Game /> : <Login />}</>;
  //   return <Login />;
}
