import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAuctionCollections } from "src/api/auction";

const useAuctionCollections = () => {
  const { auctionType } = useParams();
  return useInfiniteQuery({
    queryKey: ["auctioncollection", auctionType],
    queryFn: async ({ pageParam }) => {
      return await getAuctionCollections(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage?.data && lastPage?.data?.length >= lastPage?.first) {
        return {
          auctionType,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { auctionType },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionCollections;