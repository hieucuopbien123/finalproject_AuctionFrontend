import { useQuery } from "@tanstack/react-query";
import { getAuctionsStats } from "src/api/auction";
import { useAppContext } from "src/context/useAppContext";

const useAuctionStats = ({ auctionType }) => {
  const { refetchQuery } = useAppContext();
  return useQuery({
    queryKey: ["auctionStats", auctionType],
    queryFn: async () => {
      return await getAuctionsStats({ auctionType });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useAuctionStats;