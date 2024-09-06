import { useInfiniteQuery } from "@tanstack/react-query";
import { getBiddedAuction } from "src/api/auction";
import { useAppContext } from "src/context/useAppContext";

const useUserBiddedAuctions = ({ auctionType, orderBy = "timestamp", orderDirection = "desc", userAddress, collectionAddress, searchTerms = "", status }) => {
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["biddedAuction", userAddress, !!auctionType ? auctionType.sort() : null, orderBy, orderDirection, !!collectionAddress ? collectionAddress.sort() : null, searchTerms, `status::${status ?? 0}`],
    queryFn: async ({ pageParam }) => {
      return await getBiddedAuction(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          auctionType,
          skip: lastPage.skip,
          orderBy,
          orderDirection,
          userAddress,
          collectionAddress,
          searchTerms,
          status
        }
      }
      return null;
    },
    initialPageParam: { orderBy, orderDirection, userAddress, auctionType, collectionAddress, searchTerms, status },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useUserBiddedAuctions;