import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserActivities } from "src/api/user";
import { useAppContext } from "src/context/useAppContext";

const useUserActivities = () => {
  const { userAddress } = useParams();
  const { refetchQuery } = useAppContext();
  return useInfiniteQuery({
    queryKey: ["useractivities", userAddress],
    queryFn: async ({ pageParam }) => {
      return await getUserActivities(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if(lastPage?.data && lastPage?.data?.length >= lastPage?.first) {
        return {
          userAddress,
          skip: lastPage.skip,
        }
      }
      return null;
    },
    initialPageParam: { userAddress },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1
  });
}

export default useUserActivities;