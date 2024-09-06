import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCollectionNFTs } from "src/api/collection";

const useCollectionNFTs = () => {
  const { address } = useParams();
  return useInfiniteQuery({
    queryKey: ["collectionNFTs", address],
    queryFn: async ({ pageParam }) => {
      return await getCollectionNFTs(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(!!lastPage.cursor) {
        return {
          cursor: lastPage.cursor,
          collectionAddress: address,
        }
      }
    },
    initialPageParam: { collectionAddress: address },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
};

export default useCollectionNFTs;