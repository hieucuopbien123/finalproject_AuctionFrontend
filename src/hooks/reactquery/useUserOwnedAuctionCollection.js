import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserOwnedCollections } from "src/api/user";

const useUserOwnedAuctionCollection = () => {
  const { userAddress } = useParams();
  return useInfiniteQuery({
    queryKey: [`userownedauctioncollections`, userAddress], 
    queryFn: async ({ pageParam }) => {
      return await getUserOwnedCollections(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage.data && lastPage.data?.length > 0 && lastPage?.data?.length >= lastPage?.first) {
        return {
          userAddress,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { userAddress },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useUserOwnedAuctionCollection;