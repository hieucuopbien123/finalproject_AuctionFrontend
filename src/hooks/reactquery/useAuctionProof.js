import { useQuery } from "@tanstack/react-query";
import { getProofs } from "src/api/auction";

const useAuctionProof = ({auctionAddress}) => {
  return useQuery({
    queryKey: ["auctionProof", auctionAddress],
    queryFn: async () => {
      return await getProofs({ auctionAddress });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionProof;