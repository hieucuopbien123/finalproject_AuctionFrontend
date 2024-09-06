import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNFTDetailTransfer } from "src/api/collection";
import { useAppContext } from "src/context/useAppContext";

const useNFTDetailTransfer = () => {
  const { address, tokenId } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["nftDetailTransfers", address, tokenId],
    queryFn: async ({ pageParam }) => {
      return await getNFTDetailTransfer(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(!!lastPage.cursor) {
        return {
          nftaddress: address, 
          nftId: tokenId,
          cursor: lastPage.cursor,
        }
      }
    },
    initialPageParam: { nftaddress: address, nftId: tokenId },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1
  });
}

export default useNFTDetailTransfer;