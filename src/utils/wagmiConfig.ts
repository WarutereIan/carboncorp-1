import { http, createConfig } from "wagmi";
import { liskSepolia, base, baseSepolia } from "wagmi/chains";

import {
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

const projectId = "09c1182f7b2cb58c98f0b8ed1f223d91";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [coinbaseWallet],
    },
    /* {
      groupName: "Popular",
      wallets: [rainbowWallet, metaMaskWallet],
    }, */
    {
      groupName: "Wallet Connect",
      wallets: [walletConnectWallet],
    },
  ],
  {
    appName: "carboncorp",
    projectId: projectId,
  }
);

export const config = createConfig({
  //chains: [mainnet, sepolia, liskSepolia, baseSepolia],
  chains: [liskSepolia, base, baseSepolia],

  connectors,
  transports: {
    //[mainnet.id]: http(),
    //[sepolia.id]: http(),
    [liskSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});
