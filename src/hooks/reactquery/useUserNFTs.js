import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserNFTs } from "src/api/user";
import { useAppContext } from "src/context/useAppContext";

const useUserNFTs = ({ collectionAddress }) => {
  const { userAddress } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["userNFTs", userAddress, collectionAddress?.map(c => c?.address?.toLowerCase())?.sort()],
    queryFn: async ({ pageParam }) => {
      return await getUserNFTs(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(!!lastPage.cursor) {
        return {
          userAddress: userAddress,
          cursor: lastPage.cursor,
          collectionAddress: [collectionAddress],
        }
      }
    },
    initialPageParam: { userAddress, collectionAddress },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useUserNFTs;