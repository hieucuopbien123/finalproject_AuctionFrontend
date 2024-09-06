import { useQuery } from "@tanstack/react-query";
import { getOneAuction } from "src/api/auction";
import { useAppContext } from "src/context/useAppContext";

const useAuctionDetail = ({auctionAddress}) => {  
  const { refetchQuery } = useAppContext();
  return useQuery({
    queryKey: ["auctionDetail", auctionAddress],
    queryFn: async () => {
      return await getOneAuction({ auctionAddress });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionDetail;