import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUserInfo } from "src/api/user";
import { useAppContext } from "src/context/useAppContext";

const useUserBasicInfo = ({userAddress}) => {
  const { refetchQuery } = useAppContext();
  return useQuery({
    queryKey: ["user", userAddress], 
    queryFn: async () => {
      return await getUserInfo({userAddress});
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useUserBasicInfo;