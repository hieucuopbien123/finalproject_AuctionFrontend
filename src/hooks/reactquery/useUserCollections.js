import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserCollections } from "src/api/user";

const useUserCollections = () => {
  const { userAddress } = useParams();
  return useInfiniteQuery({
    queryKey: ["userCollections", userAddress], 
    queryFn: async ({ pageParam }) => {
      return await getUserCollections(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(!!lastPage.cursor) {
        return {
          userAddress: userAddress,
          cursor: lastPage.cursor
        }
      }
    },
    initialPageParam: { userAddress },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useUserCollections;