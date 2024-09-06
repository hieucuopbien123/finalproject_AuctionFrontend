import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAuctionCreators } from "src/api/auction";

const useAuctionCreators = () => {
  const { auctionType } = useParams();
  return useInfiniteQuery({
    queryKey: ["auctioncreator", parseInt(auctionType)],
    queryFn: async ({ pageParam }) => {
      return await getAuctionCreators(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage?.data && lastPage?.data?.length >= lastPage?.first) {
        return {
          auctionType: parseInt(auctionType),
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { auctionType: parseInt(auctionType) },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionCreators;