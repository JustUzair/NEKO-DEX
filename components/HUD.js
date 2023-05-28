import contractAddresses from "../constants/networkMappings.json";
import ierc20Abi from "../constants/ierc20Abi.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import hudGlobalDonationAbi from "../constants/globalDonationsHUDAbi.json";
import { useEffect } from "react";
export const HUD = () => {
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  const { enableWeb3, authenticate, account, isWeb3Enabled } = useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const ReceiverAddress = // donation receiver address
    chainId in contractAddresses
      ? contractAddresses[chainId]["CharityAddress"][
          contractAddresses[chainId]["CharityAddress"].length - 1
        ]
      : null;
  const getGlobalDonations = async () => {
    if (ReceiverAddress == null) return;
    if (!isWeb3Enabled) enableWeb3();
    if (account) {
      await runContractFunction({
        params: {
          abi: hudGlobalDonationAbi,
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
          data.map(item => {
            console.log(item);
          });
          //   dispatch({
          //     type: "success",
          //     message: `TX : ${data.tx} submitted, wait for tx to complete🔃`,
          //     title: `TX : ${data.tx} submitted successfully`,
          //     position: "topR",
          //   });
          //   await data.wait(1);
          //   successNotification("Test Tokens Minted Successfully!");
        },
      });
    }
  };
  useEffect(() => {
    getGlobalDonations();
  }, []);
  return (
    <div className="HUD">
      <div className="global-donations">Global donations : $15,000,000,000</div>

      {/* <div className="inventory">
            <div>Inventory</div>
            <div > <img className="inventory-item" src="https://i.ibb.co/CWfhL6J/image.png"/> 10</div>
            <div ><img className="inventory-item" src="https://i.ibb.co/YRYQ82y/image.png"/> 15 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/ZLW9d4x/image.png"/> 19 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/26fPzxF/image.png"/>100</div>
          
        </div> */}
    </div>
  );
};
