import { http, createConfig } from "wagmi";
import { liskSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

//const projectId = "f76be941c7ff7f66349322dc7b7a85f7";

export const config = createConfig({
  //chains: [mainnet, sepolia, liskSepolia, baseSepolia],
  chains: [liskSepolia],

  connectors: [metaMask()],
  transports: {
    //[mainnet.id]: http(),
    //[sepolia.id]: http(),
    [liskSepolia.id]: http(),
    //[baseSepolia.id]: http(),
  },
  ssr: true,
});
