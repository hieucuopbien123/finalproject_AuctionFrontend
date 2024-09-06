import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNFTDetail } from "src/api/collection";

const useNFTDetail = () => {
  const { address, tokenId } = useParams();
  return useQuery({
    queryKey: ["nftDetail", address, tokenId],
    queryFn: async () => {
      return await getNFTDetail({nftaddress: address, nftId: tokenId});
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useNFTDetail;