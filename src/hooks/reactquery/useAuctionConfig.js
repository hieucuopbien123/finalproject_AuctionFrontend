import { useQuery } from "@tanstack/react-query";
import { getAuctionConfig } from "src/api/contracts/interaction/AuctionFactoryContract";
import { useChainId } from "wagmi";

const useAuctionConfig = () => {
  const chainId = useChainId();
  return useQuery({
    queryKey: [`/auctionconfig/${chainId}`], 
    queryFn: async () => {
      return await getAuctionConfig();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionConfig;