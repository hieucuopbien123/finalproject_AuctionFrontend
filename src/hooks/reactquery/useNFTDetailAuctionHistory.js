import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNFTDetailAuctionHistory } from "src/api/collection";
import { useAppContext } from "src/context/useAppContext";

const useNFTDetailAuctionHistory = () => {
  const { address, tokenId } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["nftdetailauctionhistory", address, tokenId],
    queryFn: async ({ pageParam }) => {
      return await getNFTDetailAuctionHistory(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          nftaddress: address, 
          nftId: tokenId,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { nftaddress: address, nftId: tokenId },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1
  });
};

export default useNFTDetailAuctionHistory;