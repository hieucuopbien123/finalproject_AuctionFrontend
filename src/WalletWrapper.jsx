import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  lightTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia
} from '@wagmi/core/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useAppContext } from 'src/context/useAppContext';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: import.meta.env.VITE_RAINBOW,
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
});

const queryClient = new QueryClient();

const WalletWrapper = ({ children }) => {
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={currentMode == "dark" ? darkTheme() : lightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletWrapper;