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
        <div style={{ textAlign: "center", paddingTop: "50px" }}>
          Would you like to withdraw test tokens?
          <br />
          <br />
          <div>10,000 USDC</div>
          <div>5 Wrapped Ether </div>
          <div>0.5 Wrapped Bitcoin</div>
          <div>600 LINK </div>
          <div>10,000 DAI</div>
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
