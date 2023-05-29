import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Leaderboard } from "./leaderboard.js";
import { AaveStake } from "./aaveStake.js";
import { NyanCat } from "./nyanCat.js";
import { HUD } from "./HUD.js";
import { ATM } from "./ATM.js";
import axios from "axios";
import SwapPoolView from "./swapPoolView.js";
import StickyBoard from "./stickyNotes.js";

import leftImage from "../public/assets/left.gif";
import rightImage from "../public/assets/right.gif";
import idleImage from "../public/assets/idle.gif";
import downImage from "../public/assets/down.gif";
import upImage from "../public/assets/up.gif";
import worker from "../public/assets/worker.gif";
import { useMoralis, useWeb3Contract } from "react-moralis";

import contractAddresses from "../constants/networkMappings.json";
import ierc20Abi from "../constants/ierc20Abi.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

import chainlinkFeedGlobalDonationOKX from "../constants/okxChainFeedAbi.json";
import chainlinkFeedGlobalDonationPolygon from "../constants/polygonChainlinkFeedAbi.json";

const BOX_COLOR = "#ccc";
const INNER_BOX_SIZE = 70;
const INNER_BOX_COLOR = "blue";
const KEY_CODES = {
  UP: 38,
  LEFT: 37,
  DOWN: 40,
  RIGHT: 39,
};
const OBSTACLE_WIDTH = 75;
const OBSTACLE_HEIGHT = 300;

const BOARD_WIDTH = 230;
const BOARD_HEIGHT = 50;

export default function Game() {
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled } = useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [globalDonations, setGlobalDonations] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [totalDonationsInUSD, setTotalDonationsInUSD] = useState(0);
  const [globalDonationsPolygon, setGlobalDonationsPolygon] = useState(0);
  const [globalDonationsOKX, setGlobalDonationsOKX] = useState([]);

  const ReceiverAddress = // donation receiver address
    chainId in contractAddresses
      ? contractAddresses[chainId]["CharityAddress"][
          contractAddresses[chainId]["CharityAddress"].length - 1
        ]
      : null;

  const USDCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const WETHTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
        ]
      : null;
  const WBTCTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
        ]
      : null;
  const LINKTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
        ]
      : null;
  const DAITestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAI"][
          contractAddresses[chainId]["DAI"].length - 1
        ]
      : null;
  const getGlobalDonationsPolygon = async () => {
    if (ReceiverAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: chainlinkFeedGlobalDonationPolygon,
          contractAddress: ReceiverAddress,
          functionName: "getTotalWithdrawnUSD",
          params: {},
        },
        onError: error => {
          console.error(error);
          //   failureNotification(error.message);
        },
        onSuccess: async data => {
          //   console.log(`Polygon : `, parseFloat(data.toString()) / 100);
          setGlobalDonationsPolygon([
            (parseFloat(data.toString()) / 100).toString(),
          ]);
        },
      });
    }
  };
  const getGlobalDonationsOKX = async () => {
    if (ReceiverAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: chainlinkFeedGlobalDonationOKX,
          contractAddress: ReceiverAddress,
          functionName: "getKnownTokensDonated",
          params: {},
        },
        onError: error => {
          console.error(error);
          //   failureNotification(error.message);
        },
        onSuccess: async data => {
          console.log(data);
          const arr1 = [];
          data.map(item => {
            const donation = {};
            donation["donatedTokenAddress"] = item[0];
            donation["donatedTokenAmount"] = ethers.utils
              .formatEther(item[1].toString())
              .toString();
            donation["donationTokenSymbol"] =
              (donation.donatedTokenAddress == USDCTestTokenContractAddress &&
                "USDC") ||
              (donation.donatedTokenAddress == WETHTestTokenContractAddress &&
                "WETH") ||
              (donation.donatedTokenAddress == WBTCTestTokenContractAddress &&
                "WBTC") ||
              (donation.donatedTokenAddress == LINKTestTokenContractAddress &&
                "LINK") ||
              (donation.donatedTokenAddress == DAITestTokenContractAddress &&
                "DAI");
            donation["donationTokenImage"] =
              (donation.donatedTokenAddress == USDCTestTokenContractAddress &&
                "https://app.aave.com/icons/tokens/usdc.svg") ||
              (donation.donatedTokenAddress == WETHTestTokenContractAddress &&
                "https://app.aave.com/icons/tokens/weth.svg") ||
              (donation.donatedTokenAddress == WBTCTestTokenContractAddress &&
                "https://app.aave.com/icons/tokens/wbtc.svg") ||
              (donation.donatedTokenAddress == LINKTestTokenContractAddress &&
                "https://app.aave.com/icons/tokens/link.svg") ||
              (donation.donatedTokenAddress == DAITestTokenContractAddress &&
                "https://app.aave.com/icons/tokens/dai.svg");
            arr1.push(donation);
            // console.log(arr1);
          });
          console.log(arr1);
          setGlobalDonationsOKX(prevState => [...prevState, ...arr1]);
        },
      });
    }
  };
  useEffect(() => {
    if (chainId != null && (chainId == 80001 || chainId == 137))
      getGlobalDonationsPolygon();
    if (chainId != null && (chainId == 65 || chainId == 66)) {
      getGlobalDonationsOKX();
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId != null && (chainId == 65 || chainId == 66)) {
      const COINGECKO_PRICE_FEED_URL =
        "https://api.coingecko.com/api/v3/simple/price?ids=weth,wrapped-bitcoin,usd-coin,dai,chainlink&vs_currencies=usd";
      try {
        axios.get(COINGECKO_PRICE_FEED_URL).then(res => {
          const data = res.data;
          console.log(data);
          // setCoinPriceData(data);
          const value =
            data?.["usd-coin"].usd * globalDonationsOKX[0]?.donatedTokenAmount +
            data?.weth.usd * globalDonationsOKX[1]?.donatedTokenAmount +
            data?.["wrapped-bitcoin"].usd *
              globalDonationsOKX[2]?.donatedTokenAmount +
            data?.chainlink.usd * globalDonationsOKX[3]?.donatedTokenAmount +
            data?.dai.usd * globalDonationsOKX[4]?.donatedTokenAmount;
          console.log(value);
          setTotalDonationsInUSD(parseFloat(value).toFixed(2));
        });
        //   console.log(coinPriceData);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [chainId, globalDonationsOKX]);

  /////////////////// LOGIN//////////////////
  // const [showLogin, setShowLogin] = useState(true);

  // const Login = () => {
  //   return (
  //     <div style={{color:"white"}}className="container">
  //       <h1> Login </h1>
  //       Please connect your wallet to continue
  //       <button onClick={() => setShowLogin(false)}> Login </button>
  //     </div>
  //   );
  // };

  /////////////////////GAME CODE ////////////////////

  const [innerBoxPosition, setInnerBoxPosition] = useState({
    top: 500,
    left: 255,
  });
  // const [showDEX, setShowDEX] = useState(false);
  // const [showBoard, setShowBoard] = useState(false);

  // const [showDEXText, setShowDEXText] = useState(false);
  // const [showBoardText, setShowBoardText] = useState(false);

  const [direction, setDirection] = useState("left");

  // const [collision, setCollision] = useState(false);

  const [showControls, setShowControls] = useState(true);

  const [showRoom1, setShowRoom1] = useState(true);

  const [showRoom2, setShowRoom2] = useState(false);

  const [isIdle, setIsIdle] = useState(true);

  const getImage = () => {
    if (isIdle) {
      return idleImage;
    } else {
      switch (direction) {
        case "left":
          return leftImage;
        case "right":
          return rightImage;
        case "up":
          return upImage;
        case "down":
          return downImage;
        default:
          return idleImage;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsIdle(true);
    }, 300);

    return () => clearInterval(interval);
  }, [innerBoxPosition]);

  /////////////////////////ROOM 1//////////////////////////////

  const Room1 = () => {
    const [showDEX, setShowDEX] = useState(false);
    const [showBoard, setShowBoard] = useState(false);

    const [showDEXText, setShowDEXText] = useState(false);
    const [showBoardText, setShowBoardText] = useState(false);
    const [showATM, setShowATM] = useState(false);
    const [showATMText, setShowATMText] = useState(false);

    const [usingModal, setUsingModal] = useState(false);

    const BOX_HEIGHT = 600;
    const BOX_WIDTH = 800;

    useEffect(() => {
      function handleKeyPress(event) {
        const { keyCode } = event;
        const { top, left } = innerBoxPosition;
        const maxTop = BOX_HEIGHT - INNER_BOX_SIZE;
        const maxLeft = BOX_WIDTH - INNER_BOX_SIZE;
        const minTop = 30; // 30 is the height of the top bar
        const minLeft = 0; // 0 is the left position of the left bar

        if (!usingModal) {
          switch (keyCode) {
            case KEY_CODES.UP:
              setInnerBoxPosition({
                top: Math.max(minTop + 140, top - 10),
                left,
              });
              setDirection("up");
              setIsIdle(false);
              setShowControls(false);
              break;

            case KEY_CODES.LEFT:
              setInnerBoxPosition({
                top,
                left: Math.max(minLeft + 185, left - 10),
              });
              setDirection("left");
              setIsIdle(false);
              setShowControls(false);

              break;
            case KEY_CODES.DOWN:
              setInnerBoxPosition({ top: Math.min(maxTop, top + 10), left });
              setDirection("down");
              setIsIdle(false);
              setShowControls(false);
              break;
            case KEY_CODES.RIGHT:
              setInnerBoxPosition({ top, left: Math.min(maxLeft, left + 10) });
              setDirection("right");
              setIsIdle(false);
              setShowControls(false);
              break;
            default:
              setIsIdle(true);
              break;
          }
        }
      }

      window?.addEventListener("keydown", handleKeyPress);

      return () => {
        window?.removeEventListener("keydown", handleKeyPress);
      };
    }, [innerBoxPosition]);

    useEffect(() => {
      function checkCollision() {
        const innerBoxRect = document
          .querySelector(".inner-box")
          .getBoundingClientRect();
        const obstacleRect = document
          .querySelector(".obstacle")
          .getBoundingClientRect();
        const boardRect = document
          .querySelector(".board")
          .getBoundingClientRect();
        const table1Rect = document
          .querySelector(".table1")
          .getBoundingClientRect();
        const leaveRoomRect1 = document
          .querySelector(".leaveRoom1")
          .getBoundingClientRect();
        const ATMRect = document.querySelector(".ATM").getBoundingClientRect();

        if (
          !showDEX &&
          !showBoard &&
          innerBoxRect.left < obstacleRect.right &&
          innerBoxRect.right > obstacleRect.left &&
          innerBoxRect.top < obstacleRect.bottom &&
          innerBoxRect.bottom > obstacleRect.top
        ) {
          console.log("testing");
          setShowBoardText(false);
          setShowDEXText(true);
        }
        if (
          !showDEX &&
          !showBoard &&
          innerBoxRect.left < obstacleRect.right &&
          innerBoxRect.right > obstacleRect.left &&
          innerBoxRect.top < obstacleRect.bottom &&
          innerBoxRect.bottom > obstacleRect.top
        ) {
          console.log("testing");
          setShowBoardText(false);
          setShowDEXText(true);
        }
        if (
          !showDEX &&
          !showBoard &&
          innerBoxRect.left < boardRect.right &&
          innerBoxRect.right > boardRect.left &&
          innerBoxRect.top < boardRect.bottom &&
          innerBoxRect.bottom > boardRect.top
        ) {
          setShowDEXText(false);
          setShowBoardText(true);
        }

        if (
          innerBoxRect.left < table1Rect.right &&
          innerBoxRect.right > table1Rect.left &&
          innerBoxRect.top < table1Rect.bottom &&
          innerBoxRect.bottom > table1Rect.top
        ) {
        }

        if (
          innerBoxRect.left < leaveRoomRect1.right &&
          innerBoxRect.right > leaveRoomRect1.left &&
          innerBoxRect.top < leaveRoomRect1.bottom &&
          innerBoxRect.bottom > leaveRoomRect1.top
        ) {
          setShowRoom1(false);
          setShowRoom2(true);
          setInnerBoxPosition({ top: 400, left: 20 });
          console.log("leave room 1");
        }
        // if (
        //   innerBoxRect.left < catRect.right &&
        //   innerBoxRect.right > catRect.left &&
        //   innerBoxRect.top < catRect.bottom &&
        //   innerBoxRect.bottom > catRect.top
        // ) {
        //   setNekoText(true);
        // }
        // if (
        //   !(
        //     innerBoxRect.left < catRect.right &&
        //     innerBoxRect.right > catRect.left &&
        //     innerBoxRect.top < catRect.bottom &&
        //     innerBoxRect.bottom > catRect.top
        //   )
        // ) {
        //   setNekoText(false);
        //   setShowNeko(false);
        // }
        if (
          !showDEX &&
          !showBoard &&
          innerBoxRect.left < obstacleRect.right &&
          innerBoxRect.right > obstacleRect.left &&
          innerBoxRect.top < obstacleRect.bottom &&
          innerBoxRect.bottom > obstacleRect.top
        ) {
          setShowBoardText(false);
          setShowDEXText(true);
        }
        if (
          !(
            innerBoxRect.left - 30 < obstacleRect.right &&
            innerBoxRect.right + 30 > obstacleRect.left &&
            innerBoxRect.top - 30 < obstacleRect.bottom &&
            innerBoxRect.bottom + 30 > obstacleRect.top
          )
        ) {
          setShowDEXText(false);
        }

        if (
          !(
            innerBoxRect.left - 30 < boardRect.right &&
            innerBoxRect.right + 30 > boardRect.left &&
            innerBoxRect.top - 30 < boardRect.bottom &&
            innerBoxRect.bottom + 30 > boardRect.top
          )
        ) {
          setShowBoardText(false);
        }

        if (
          !showDEX &&
          !showBoard &&
          innerBoxRect.left < ATMRect.right &&
          innerBoxRect.right > ATMRect.left &&
          innerBoxRect.top < ATMRect.bottom &&
          innerBoxRect.bottom > ATMRect.top
        ) {
          setShowBoardText(false);
          setShowATMText(true);
        }
        if (
          !(
            innerBoxRect.left - 30 < ATMRect.right &&
            innerBoxRect.right + 30 > ATMRect.left &&
            innerBoxRect.top - 30 < ATMRect.bottom &&
            innerBoxRect.bottom + 30 > ATMRect.top
          )
        ) {
          setShowATMText(false);
        }
      }

      checkCollision();
    }, [innerBoxPosition]);

    function showDexFunc() {
      setShowDEX(true);
      setShowDEXText(false);
    }

    function showBoardFunc() {
      setShowBoard(true);
      setShowBoardText(false);
    }

    function showATMFunc() {
      setShowATM(true);
      setShowATMText(false);
    }

    // function Neko() {
    //   setNekoText(false);
    //   setShowNeko(true);
    // }

    const DisplayControls = () => {
      return (
        <div className="infoPanelControls">
          <div className="typedOutInfo">
            <p>
              Use the arrow keys <br /> to move around
            </p>
          </div>
        </div>
      );
    };

    return (
      <div className="container">
        <div
          className="box"
          style={{
            height: BOX_HEIGHT,
            width: BOX_WIDTH,
          }}
        >
          <HUD
            chainId={chainId}
            globalDonationsOKX={globalDonationsOKX}
            globalDonationsPolygon={globalDonationsPolygon}
            totalDonationsInUSD={totalDonationsInUSD}
          />

          {/*  THE CHARACTER DIV */}
          <div className="bottom-right-div"></div>
          <div
            className={`inner-box ${direction}`}
            style={{
              height: INNER_BOX_SIZE,
              width: INNER_BOX_SIZE,
              backgroundImage: `url(${getImage().src})`,
              top: innerBoxPosition.top,
              left: innerBoxPosition.left,
              backgroundPosition: "0 -10px",
            }}
          ></div>
          <div
            className="obstacle"
            style={{
              height: OBSTACLE_HEIGHT,
              width: OBSTACLE_WIDTH,
            }}
          ></div>
          <div
            className="board"
            style={{
              height: BOARD_HEIGHT,
              width: BOARD_WIDTH,
            }}
          ></div>

          {showControls && <DisplayControls />}

          {showDEXText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut">
                  Hello, would you like to access our DEX?
                </div>{" "}
              </div>
              <div className="textSelect" onClick={() => showDexFunc(true)}>
                {" "}
                Okay{" "}
              </div>
              <div
                className="textSelect2"
                onClick={() => setShowDEXText(false)}
              >
                {" "}
                No thanks{" "}
              </div>
            </div>
          )}
          {showBoardText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut">View the sticky notes?</div>
              </div>
              <div className="textSelect" onClick={() => showBoardFunc(true)}>
                {" "}
                Okay{" "}
              </div>
              <div
                className="textSelect2"
                onClick={() => setShowBoardText(false)}
              >
                {" "}
                No thanks{" "}
              </div>
            </div>
          )}

          {/* {nekoText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut"> View the leaderboard?</div>{" "}
              </div>
              <div className="textSelect" onClick={() => Neko()}>
                {" "}
                Okay{" "}
              </div>
              <div className="textSelect2" onClick={() => setNekoText(false)}>
                {" "}
                No thanks{" "}
              </div>{" "}
            </div>
          )} */}

          <div className="table1" />

          <div className="table2" />

          {/* <div className="ATM">ATM</div> */}
          <div
            className="ATM"
            style={{
              border: "none",
            }}
          >
            {/* <img
              src={"/assets/atm.JPG"}
              alt="atm"
              style={{
                width: "50px",
                height: "100px",
              }}
            /> */}
          </div>

          {showATMText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut">
                  Would you like to access the ATM?
                </div>{" "}
              </div>
              <div className="textSelect" onClick={() => showATMFunc(true)}>
                Okay
              </div>

              <div
                className="textSelect2"
                onClick={() => setShowATMText(false)}
              >
                No thanks
              </div>
            </div>
          )}

          {showATM && (
            <>
              <div className="modal" style={{ marginTop: "0px" }}>
                <div className="modal-content">
                  <button
                    className="modalButton"
                    onClick={() => setShowATM(false)}
                  >
                    Close
                  </button>
                  <ATM />
                </div>
              </div>
            </>
          )}

          <div className="leaveRoom1"></div>
        </div>

        {showDEX && (
          <div className="modal">
            <div
              className="modal-content"
              style={{
                position: "relative",
              }}
            >
              <>
                <SwapPoolView />
              </>
              <button
                className="modalButton"
                style={{
                  position: "absolute",
                  right: "5%",
                  bottom: "10px",
                  zIndex: "999",
                }}
                onClick={() => setShowDEX(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showBoard && (
          <>
            <div className="modal">
              <div
                style={{
                  border: "10px solid #954434",
                  background: "#ECA97C",
                  borderRadius: "0",
                }}
                className="modal-content"
              >
                <StickyBoard />
                <button
                  className="modalButton"
                  style={{
                    zIndex: 11,
                    position: "absolute",
                    bottom: "26%",
                    right: "33%",
                  }}
                  onClick={() => setShowBoard(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* {showNeko && (
          <>
            <div className="modal">
              <div className="modal-content">
                <Leaderboard />
                <button
                  className="modalButton"
                  onClick={() => setShowNeko(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )} */}

        {/* <Image
          className="neko"
          src="https://66.media.tumblr.com/tumblr_ma11pbpN0j1rfjowdo1_500.gif"
          width={400}
          height={500}
          alt="neko"
        /> */}

        {/* <Image className="worker" src={worker} alt="worker" /> */}
      </div>
    );
  };

  /////////////////////////ROOM 2//////////////////////////////

  const Room2 = () => {
    const BOX_HEIGHT = 600;
    const BOX_WIDTH = 800;

    const [nekoText, setNekoText] = useState(false);
    const [showStaking, setShowStaking] = useState(false);
    const [showNeko, setShowNeko] = useState(false);
    const [inModal, setInModal] = useState(false);
    const [stakeText, setStakeText] = useState(false);

    useEffect(() => {
      function handleKeyPress(event) {
        const { keyCode } = event;
        const { top, left } = innerBoxPosition;
        const maxTop = BOX_HEIGHT - INNER_BOX_SIZE;
        const maxLeft = BOX_WIDTH - INNER_BOX_SIZE;
        const minTop = 160;
        const minLeft = 0;

        switch (keyCode) {
          case KEY_CODES.UP:
            setInnerBoxPosition({ top: Math.max(minTop, top - 10), left });
            setDirection("up");
            setIsIdle(false);

            break;
          case KEY_CODES.LEFT:
            setInnerBoxPosition({
              top,
              left: Math.max(minLeft, left - 10),
            });
            setDirection("left");
            setIsIdle(false);
            break;
          case KEY_CODES.DOWN:
            setInnerBoxPosition({ top: Math.min(maxTop, top + 10), left });
            setDirection("down");
            setIsIdle(false);
            break;
          case KEY_CODES.RIGHT:
            setInnerBoxPosition({ top, left: Math.min(maxLeft, left + 10) });
            setDirection("right");
            setIsIdle(false);
            break;
            setIsIdle(true);
            break;
        }
      }

      window?.addEventListener("keydown", handleKeyPress);

      return () => {
        window?.removeEventListener("keydown", handleKeyPress);
      };
    }, [innerBoxPosition]);

    function Neko() {
      setNekoText(false);
      setShowNeko(true);
    }

    function Stake() {
      setStakeText(false);
      setShowStaking(true);
    }

    useEffect(() => {
      function checkCollision() {
        const innerBoxRect = document
          .querySelector(".inner-box")
          .getBoundingClientRect();
        const leaveRoom2 = document
          .querySelector(".leaveRoom2")
          .getBoundingClientRect();
        const aaveStake = document
          .querySelector(".aaveStake")
          .getBoundingClientRect();

        const catRect = document.querySelector(".neko").getBoundingClientRect();
        const stakeRect = document
          .querySelector(".aaveStake")
          .getBoundingClientRect();

        if (
          innerBoxRect.left + 50 < leaveRoom2.right &&
          innerBoxRect.right < leaveRoom2.left + 170 &&
          innerBoxRect.top < leaveRoom2.bottom &&
          innerBoxRect.bottom > leaveRoom2.top
        ) {
          setShowRoom2(false);
          setShowRoom1(true);
          setInnerBoxPosition({ top: 230, left: 600 });
          console.log("leave room 2");
        }

        if (
          innerBoxRect.left < catRect.right &&
          innerBoxRect.right > catRect.left &&
          innerBoxRect.top < catRect.bottom &&
          innerBoxRect.bottom > catRect.top
        ) {
          setNekoText(true);
        }
        if (
          !(
            innerBoxRect.left < catRect.right &&
            innerBoxRect.right > catRect.left &&
            innerBoxRect.top < catRect.bottom &&
            innerBoxRect.bottom > catRect.top
          )
        ) {
          setNekoText(false);
          setShowNeko(false);
        }

        if (
          innerBoxRect.left < stakeRect.right &&
          innerBoxRect.right > stakeRect.left &&
          innerBoxRect.top < stakeRect.bottom &&
          innerBoxRect.bottom > stakeRect.top
        ) {
          setStakeText(true);
        }
        if (
          !(
            innerBoxRect.left < stakeRect.right &&
            innerBoxRect.right > stakeRect.left &&
            innerBoxRect.top < stakeRect.bottom &&
            innerBoxRect.bottom > stakeRect.top
          )
        ) {
          setStakeText(false);
          setShowStaking(false);
        }
      }

      checkCollision();
    }, [innerBoxPosition]);

    return (
      <div className="container">
        <div className="box2" style={{ height: BOX_HEIGHT, width: BOX_WIDTH }}>
          <div className="leaveRoom2">
            <span>
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                }}
              ></span>
            </span>
          </div>

          <div
            className={`inner-box ${direction}`}
            style={{
              height: INNER_BOX_SIZE,
              width: INNER_BOX_SIZE,
              backgroundImage: `url(${getImage().src})`,
              top: innerBoxPosition.top,
              left: innerBoxPosition.left,
              backgroundPosition: "0 -10px",
            }}
          ></div>

          <div className="aaveStake" />

          {nekoText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut"> View the leaderboard?</div>{" "}
              </div>
              <div className="textSelect" onClick={() => Neko()}>
                {" "}
                Okay{" "}
              </div>
              <div className="textSelect2" onClick={() => setNekoText(false)}>
                {" "}
                No thanks{" "}
              </div>{" "}
            </div>
          )}

          {showNeko && (
            <>
              <div style={{ marginTop: "0px" }} className="modal">
                <div className="modal-content">
                  <Leaderboard />
                  <button
                    className="modalButton"
                    onClick={() => setShowNeko(false)}
                    style={{
                      position: "absolute",
                      right: "11%",
                      bottom: "12%",
                      zIndex: "999",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}

          <Image
            className="neko"
            src="https://66.media.tumblr.com/tumblr_ma11pbpN0j1rfjowdo1_500.gif"
            width={400}
            height={500}
            alt="neko"
          />

          <div className="aaveStakeCat" />

          <img
            style={{
              position: "absolute",
              bottom: "280px",
              right: "175px",
              width: "40px",
              height: "40px",
              zIndex: "1",
            }}
            src="https://i.pinimg.com/originals/80/7b/5c/807b5c4b02e765bb4930b7c66662ef4b.gif"
          />

          <div className="nekoSparkle" />

          {showStaking && (
            <>
              <button
                className="modalButton"
                onClick={() => setShowStaking(false)}
                style={{
                  position: "absolute",
                  right: "11%",
                  bottom: "8%",
                  zIndex: "999",
                }}
              >
                Close
              </button>{" "}
              <AaveStake />
            </>
          )}

          {stakeText && (
            <div className="textBox">
              <div className="typedOutWrapper">
                <div className="typedOut"> Look at the staking screen?</div>{" "}
              </div>
              <div className="textSelect" onClick={() => Stake()}>
                {" "}
                Okay{" "}
              </div>
              <div className="textSelect2" onClick={() => setStakeText(false)}>
                {" "}
                No thanks{" "}
              </div>{" "}
            </div>
          )}
        </div>
      </div>
    );
  };

  ////////////////////// RETURN //////////////////////////////

  return (
    <>
      {showRoom1 && <Room1 />}

      {showRoom2 && <Room2 />}
    </>
  );
}
