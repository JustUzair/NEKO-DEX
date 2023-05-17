import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Leaderboard } from "../components/leaderboard.js";

import SwapPoolView from "../components/swapPoolView.js";
import StickyBoard from "../components/stickyNotes.js";

import leftImage from "../public/assets/left.gif";
import rightImage from "../public/assets/right.gif";
import idleImage from "../public/assets/idle.gif";
import downImage from "../public/assets/down.gif";
import upImage from "../public/assets/up.gif";

import worker from "../public/assets/worker.gif";
import { useMoralis, useWeb3Contract } from "react-moralis";

const BOX_HEIGHT = 600;
const BOX_WIDTH = 800;
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

export function Game() {
  const { enableWeb3, authenticate, account, isWeb3Enabled } = useMoralis();
  useEffect(() => {
    enableWeb3();
  }, []);
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
  const [showDEX, setShowDEX] = useState(false);
  const [showBoard, setShowBoard] = useState(false);

  const [showDEXText, setShowDEXText] = useState(false);
  const [showBoardText, setShowBoardText] = useState(false);

  const [direction, setDirection] = useState("left");

  const [collision, setCollision] = useState(false);

  const [nekoText, setNekoText] = useState(false);

  const [showNeko, setShowNeko] = useState(false);

  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    function handleKeyPress(event) {
      const { keyCode } = event;
      const { top, left } = innerBoxPosition;
      const maxTop = BOX_HEIGHT - INNER_BOX_SIZE;
      const maxLeft = BOX_WIDTH - INNER_BOX_SIZE;
      const minTop = 0;
      const minLeft = 0;

      switch (keyCode) {
        case KEY_CODES.UP:
          setInnerBoxPosition({ top: Math.max(minTop + 140, top - 10), left });
          setDirection("up");
          setIsIdle(false);
          break;
        case KEY_CODES.LEFT:
          setInnerBoxPosition({
            top,
            left: Math.max(minLeft + 185, left - 10),
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
        default:
          setIsIdle(true);
          break;
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
      const table2Rect = document
        .querySelector(".table2")
        .getBoundingClientRect();

      const catRect = document.querySelector(".neko").getBoundingClientRect();

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
        innerBoxRect.left < table2Rect.right &&
        innerBoxRect.right > table2Rect.left &&
        innerBoxRect.top < table2Rect.bottom &&
        innerBoxRect.bottom > table2Rect.top
      ) {
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

  function Neko() {
    setNekoText(false);
    setShowNeko(true);
  }

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

  return (
    <div className="container">
      <div
        className="box"
        style={{
          height: BOX_HEIGHT,
          width: BOX_WIDTH,
        }}
      >
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
            <div className="textSelect2" onClick={() => setShowDEXText(false)}>
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

        <div className="table1" />

        <div className="table2" />
      </div>

      {showDEX && (
        <div className="modal">
          <div className="modal-content">
            <>
              <SwapPoolView />
            </>
            <button onClick={() => setShowDEX(false)}>Close</button>
          </div>
        </div>
      )}
      {showBoard && (
        <>
          <div className="modal">
            <div className="modal-content">
              <StickyBoard />
              <button
                style={{ zIndex: 11 }}
                onClick={() => setShowBoard(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {showNeko && (
        <>
          <div className="modal">
            <div className="modal-content">
              <Leaderboard />
              <button onClick={() => setShowNeko(false)}>Close</button>
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

      <Image className="worker" src={worker} alt="worker" />
    </div>
  );
}
// else{
//   <Login/>
// }
// }