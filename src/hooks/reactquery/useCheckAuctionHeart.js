import { useQuery } from "@tanstack/react-query";
import { checkAuctionHeart } from "src/api/auction";

const useCheckAuctionHeart = ({userAddress, auctionAddress}) => {
  return useQuery({
    queryKey: ["useCheckAuctionHeart", auctionAddress, userAddress],
    queryFn: async () => {
      return await checkAuctionHeart({ auctionAddress, userAddress});
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 1,
  });
}

export default useCheckAuctionHeart;