import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOneAuctionTrades } from "src/api/auction";
import { useAppContext } from "src/context/useAppContext";

const useOneAuctionTrades = () => {
  const { auctionAddress } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["useOneAuctionTrades", auctionAddress],
    queryFn: async ({ pageParam }) => {
      return await getOneAuctionTrades(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          auctionAddress,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { auctionAddress },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1
  });
}

export default useOneAuctionTrades;