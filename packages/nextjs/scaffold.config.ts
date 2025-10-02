import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "REPLACE_ME";

// Push Chain Donut Testnet
export const pushDonutChain: chains.Chain = {
  id: 42101,
  name: "Push Chain Donut Testnet",
  nativeCurrency: { name: "Push", symbol: "PC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://evm.rpc-testnet-donut-node1.push.org/", "https://evm.rpc-testnet-donut-node2.push.org/"],
    },
    public: {
      http: ["https://evm.rpc-testnet-donut-node1.push.org/", "https://evm.rpc-testnet-donut-node2.push.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Push Donut Explorer",
      url: "https://evm-explorer-testnet.push.org",
    },
  },
};

const scaffoldConfig = {
  targetNetworks: [pushDonutChain],
  pollingInterval: 30000,
  alchemyApiKey: DEFAULT_ALCHEMY_API_KEY,
  rpcOverrides: {},
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "YOUR_WALLETCONNECT_ID",
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
