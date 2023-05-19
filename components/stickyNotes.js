import React, { useState, useEffect } from "react";
import contractAddresses from "../constants/networkMappings.json";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import { useNotification } from "web3uikit";
import testTokenAbi from "../constants/TestTokenAbi.json";
import stickyNotesAbi from "../constants/StickyNotesAbi.json";

export default function StickyNotes() {
  const [stickyNotes, setStickyNotes] = useState(true);

  const [amount, setAmount] = useState(5); // donation amount
  const [message, setMessage] = useState("");

  const [notes, setNotes] = useState([]);
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled, Moralis } =
    useMoralis();
  const { web3 } = useMoralisWeb3Api();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  //****************************************************************/
  //-----------------------NOTIFICATION-----------------------------
  //****************************************************************/

  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg} Successfully! (Reload after the transaction succeeds)`,
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

  const StickyNotesContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["StickyNotes"][
          contractAddresses[chainId]["StickyNotes"].length - 1
        ]
      : null;
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
  const LeaderboardContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["Leaderboard"][
          contractAddresses[chainId]["Leaderboard"].length - 1
        ]
      : null;
  const CharityAddressContractAddress =
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
  const WMATICTestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WMATIC"][
          contractAddresses[chainId]["WMATIC"].length - 1
        ]
      : null;
  const DAITestTokenContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAI"][
          contractAddresses[chainId]["DAI"].length - 1
        ]
      : null;
  const NewNote = () => {
    return (
      <>
        <h1> Write a new note</h1>
        {/* amount to donate */}
        <label> Amount to donate </label>
        <input
          type="number"
          onChange={e => {
            setAmount(e.target.value);
          }}
          value={amount}
        />
        <br />
        {/* message of length 64 max */}
        <label>Message</label>
        <input
          style={{ height: "100px", width: "300px" }}
          type="text"
          onChange={e => {
            setMessage(e.target.value.toString());
          }}
          value={message}
        />
        <br />
        <br />
        <br />
        <button onClick={postStickyNote}>Donate</button>
      </>
    );
  };
  //   Random color for codes
  function getRandomColorCode() {
    return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)})`;
  }
  const Notes = () => {
    return (
      <div className="sticky-notes--container">
        <div
          className="note"
          style={{
            backgroundColor: `${getRandomColorCode()}`,
          }}
        >
          0x..2FAB <br />
          $100
          <br />
          Have a good day!
        </div>
      </div>
    );
  };
  const postStickyNote = async () => {
    if (!isWeb3Enabled) await enableWeb3();
    if (amount < 5) {
      failureNotification("Donation amount is minimum $5");
      return;
    }
    if (account) {
      // approve
      await runContractFunction({
        params: {
          abi: testTokenAbi,
          contractAddress: USDCTestTokenContractAddress,
          functionName: "approve",
          params: { spender: StickyNotesContractAddress, amount: amount },
        },
        onError: error => {
          failureNotification(error.message);
          console.error(error);
        },
        onSuccess: data => {
          console.log(data);
          runContractFunction({
            params: {
              abi: stickyNotesAbi,
              contractAddress: StickyNotesContractAddress,
              functionName: "newNote",
              params: { _amount: amount, _message: message },
            },
            onError: error => {
              failureNotification(error.message);
              console.error(error);
            },
            onSuccess: data => {
              //   console.log(data);
              setStickyNotes(true);
              successNotification("Amount Donated 👏");
            },
          });
        },
      });
    }
  };
  const getStickyNotes = async () => {
    console.log("here");
    if (!isWeb3Enabled) await enableWeb3();
    if (account) {
      // approve
      await runContractFunction({
        params: {
          abi: stickyNotesAbi,
          contractAddress: StickyNotesContractAddress,
          functionName: "getAllMessages",
          params: {},
        },
        onError: error => {
          failureNotification(error.message);
          console.error(error);
        },
        onSuccess: data => {
          console.log(data);

          const arr1 = [];
          data.map(item => {
            const note = {};
            note["donorAddress"] = item[0];
            note["donationAmount"] = item[1].toString();
            note["message"] = item[2];

            arr1.push(note);
            // console.log(arr1);
          });
          setNotes(prevState => [...prevState, ...arr1]);
        },
      });
    }
  };
  useEffect(() => {
    getStickyNotes();
  }, [account]);
  return (
    <>
      {StickyNotesContractAddress != null ? (
        <>
          {/* {stickyNotes && <Notes />} */}
          {stickyNotes && (
            <div className="sticky-notes--container">
              {notes.length > 0 ? (
                notes.map((item, index) => (
                  <div
                    key={index}
                    className="note"
                    style={{
                      backgroundColor: `${getRandomColorCode()}`,
                    }}
                  >
                    {item.donorAddress.substr(0, 4)}...
                    {item.donorAddress.substr(-4)} <br />
                    <span
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      ${item.donationAmount}
                    </span>
                    <br />
                    <span
                      style={{
                        wordWrap: "break-word",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.message}
                    </span>
                  </div>
                ))
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
                      No donations yet
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          {!stickyNotes && (
            // New Note
            <>
              <h1> Write a new note</h1>
              {/* amount to donate */}
              <label> Amount to donate </label>
              <br />
              <input
                type="number"
                min="5"
                onChange={e => {
                  setAmount(e.target.value);
                }}
                value={amount}
              />
              <br />
              {/* message of length 64 max */}
              <label>Message</label>
              <br />
              <textarea
                style={{ height: "100px", width: "300px" }}
                onChange={e => {
                  setMessage(e.target.value.toString());
                }}
                value={message}
              />
              <br />
              <br />
              <br />
              <button onClick={postStickyNote}>Donate</button>
            </>
          )}
          <button
            onClick={() => setStickyNotes(!stickyNotes)}
            style={{
              position: "absolute",
              bottom: "26%",
              left: "33%",
            }}
          >
            {" "}
            {stickyNotes ? "New Note" : "Back"}{" "}
          </button>
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
      )}
    </>
  );
}
