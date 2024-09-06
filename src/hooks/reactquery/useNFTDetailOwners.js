import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNFTOwners } from "src/api/collection";

const useNFTDetailOwners = () => {
  const { address: collectionAddress, tokenId: nftId } = useParams();
  return useInfiniteQuery({
    queryKey: ["useNFTDetailOwners", collectionAddress, nftId],
    queryFn: async ({ pageParam }) => {
      return await getNFTOwners(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(!!lastPage.cursor) {
        return {
          cursor: lastPage.cursor,
          collectionAddress,
          nftId
        }
      }
    },
    initialPageParam: { collectionAddress, nftId },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
};

export default useNFTDetailOwners;