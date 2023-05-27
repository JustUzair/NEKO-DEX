import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { NotificationProvider } from "web3uikit";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { MoralisProvider } from "react-moralis";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {}, []);
  const router = useRouter();
  const polygonMainnet = {
    // OKC Testnet Faucet : https://www.okx.com/en-in/oktc/faucet
    id: 137,
    name: "Polygon LlamaNodes",
    network: "Polygon LlamaNodes",

    rpcUrls: {
      default: {
        http: ["https://polygon.llamarpc.com"],
      },
    },
    blockExplorers: {
      default: {
        name: "polygon-mainnet",
        url: "https://polygonscan.com",
      },
    },
    testnet: false,
  };

  const okcChain = {
    id: 66,
    name: "OKXChain Mainnet",
    network: "OKXChain Mainnet",

    rpcUrls: {
      default: {
        http: ["https://exchainrpc.okex.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "okxchain-mainnet",
        url: "https://www.oklink.com/en/okc",
      },
    },
    testnet: false,
  };
  const okcTestnetChain = {
    // OKC Testnet Faucet : https://www.okx.com/en-in/oktc/faucet
    id: 65,
    name: "OKExChain Testnet",
    network: "OKExChain Testnet",

    rpcUrls: {
      default: {
        http: ["https://exchaintestrpc.okex.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "okxchain-testnet",
        url: "https://www.oklink.com/okexchain-test",
      },
    },
    testnet: true,
  };

  const { chains, provider } = configureChains(
    [polygonMumbai, okcChain, okcTestnetChain, polygonMainnet], // Testnet LINK  address : 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    [
      jsonRpcProvider({
        rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
      }),
      publicProvider(),
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: "Neko-DEX",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            <AnimatePresence mode="wait" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.25,
                  duration: 0.5,
                },
              }}
              exit={{
                opacity: 0,
                backgroundColor: "transparent",

                transition: {
                  delay: 0.25,
                  ease: "easeInOut",
                },
              }}
              key={router.route}
              className="content"
            >
              <Component {...pageProps} />
            </motion.div>
          </NotificationProvider>
        </MoralisProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
