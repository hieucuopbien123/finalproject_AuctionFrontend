import { mainnet, sepolia } from "@wagmi/core/chains";
import { createConfig, http } from "wagmi";
import { createWalletClient, custom } from 'viem'

export const config = createConfig({
  chains: [mainnet, {
    ...sepolia,
    rpcUrls: {
      default: {
        http: [
          `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA}`,
          'https://eth-sepolia.api.onfinality.io/public', 
          'https://eth-sepolia.public.blastapi.io', 
          'https://rpc.sepolia.org'
        ],
      },
    },
  }],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export const walletClient = createWalletClient({
  chain: mainnet,
  transport: window.ethereum ? custom(window.ethereum) : http(),
})
 
// export const [account] = await walletClient.getAddresses()