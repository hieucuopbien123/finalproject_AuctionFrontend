import { useInfiniteQuery } from "@tanstack/react-query";
import { getAuctions } from "src/api/auction";
import { useAppContext } from "src/context/useAppContext";

const useAuctions = ({ auctionType, orderBy = "timestamp", orderDirection = "desc", userAddress, collectionAddresses, searchTerms = "", status }) => {
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["auction",  !!auctionType ? auctionType.sort() : null, !!userAddress ? userAddress.sort() : null, orderBy, orderDirection, !!collectionAddresses ? collectionAddresses.sort() : null, searchTerms, `status::${status ?? 0}`],
    queryFn: async ({ pageParam }) => {
      return await getAuctions(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          auctionType,
          skip: lastPage.skip,
          orderBy,
          orderDirection,
          userAddress,
          collectionAddresses,
          searchTerms,
          status
        }
      }
      return null;
    },
    initialPageParam: { orderBy, orderDirection, userAddress, auctionType, collectionAddresses, searchTerms, status },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctions;