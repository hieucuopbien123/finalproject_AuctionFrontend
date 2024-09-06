import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNFTDetailTrades } from "src/api/collection";
import { useAppContext } from "src/context/useAppContext";

const useNFTDetailTrades = () => {
  const { address: collectionAddress, tokenId: nftId } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["useNFTDetailTrades", collectionAddress, nftId],
    queryFn: async ({ pageParam }) => {
      return await getNFTDetailTrades(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          collectionAddress, nftId,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { collectionAddress, nftId },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchInterval: () => refetchQuery ? 5000 : false,
    refetchOnMount: true,
    retry: 1
  });
}

export default useNFTDetailTrades;