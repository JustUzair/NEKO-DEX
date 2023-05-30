import contractAddresses from "../constants/networkMappings.json";
import ierc20Abi from "../constants/ierc20Abi.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import testTokenFaucetAbi from "../constants/TestTokensFaucet.json";
export const ATM = () => {
  const dispatch = useNotification();

  //****************************************************************/
  //-----------------------NOTIFICATION-----------------------------
  //****************************************************************/

  const successNotification = msg => {
    dispatch({
      type: "success",
      message: `${msg}, Enjoy Interacting with our dex 🤞`,
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

  const TestTokenFaucetAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["TestTokenFaucet"][
          contractAddresses[chainId]["TestTokenFaucet"].length - 1
        ]
      : null;
  const MintTestTokens = async () => {
    if (TestTokenFaucetAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: testTokenFaucetAbi,
          contractAddress: TestTokenFaucetAddress,
          functionName: "mintTester",
          params: {},
        },
        onError: error => {
          console.error(error);
          failureNotification(error.message);
        },
        onSuccess: async data => {
          console.log(data);
          dispatch({
            type: "success",
            message: `TX : ${data.hash} submitted, wait for tx to complete🔃`,
            title: `TX : ${data.hash} submitted successfully`,
            position: "topR",
          });
          await data.wait(1);
          successNotification("Test Tokens Minted Successfully!");
        },
      });
    }
  };

  const WETHContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WETH"][
          contractAddresses[chainId]["WETH"].length - 1
        ]
      : null;
  const WBTCContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["WBTC"][
          contractAddresses[chainId]["WBTC"].length - 1
        ]
      : null;
  const LINKContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["LINK"][
          contractAddresses[chainId]["LINK"].length - 1
        ]
      : null;
  const USDCContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["USDC"][
          contractAddresses[chainId]["USDC"].length - 1
        ]
      : null;
  const DAIContractAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId]["DAI"][
          contractAddresses[chainId]["DAI"].length - 1
        ]
      : null;
  return (
    <>
      <h2 style={{ textAlign: "center" }}>NEKO ATM</h2>
      <div
        style={{
          color: "white",
          marginLeft: "30px",
          width: "90%",
          height: "70%",
          background: "black",
        }}
      >
        <div style={{ textAlign: "left", padding: "50px 20px 0 20px" }}>
          Would you like to withdraw test tokens?{" "}
          <span
            style={{
              textDecoration: "underline",
            }}
          >
            [import them using their address]
          </span>
          <br />
          <br />
          <div>
            10,000 USDC{" "}
            <span
              style={{
                color: "#ffc800",
              }}
            >
              {USDCContractAddress}
            </span>
          </div>
          <div>
            5 Wrapped Ether{" "}
            <span
              style={{
                color: "#ffc800",
              }}
            >
              {WETHContractAddress}
            </span>{" "}
          </div>
          <div>
            0.5 Wrapped Bitcoin{" "}
            <span
              style={{
                color: "#ffc800",
              }}
            >
              {WBTCContractAddress}
            </span>
          </div>
          <div>
            600 LINK{" "}
            <span
              style={{
                color: "#ffc800",
              }}
            >
              {LINKContractAddress}
            </span>{" "}
          </div>
          <div>
            10,000 DAI{" "}
            <span
              style={{
                color: "#ffc800",
              }}
            >
              {DAIContractAddress}
            </span>
          </div>
          <div
            style={{
              position: "initial",
              margin: "auto",
              marginTop: "20px",
              textAlign: "center",
              padding: "10px",
            }}
            className="textSelect"
            onClick={MintTestTokens}
          >
            Withdraw
          </div>
        </div>
      </div>
    </>
  );
};
