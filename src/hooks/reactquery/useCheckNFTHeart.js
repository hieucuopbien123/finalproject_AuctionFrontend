import { useQuery } from "@tanstack/react-query";
import { checkNFTHeart } from "src/api/collection";

const useCheckNFTHeart = ({collectionAddress, userAddress, nftId}) => {
  return useQuery({
    queryKey: ["useCheckNFTHeart", collectionAddress, userAddress, nftId],
    queryFn: async () => {
      return await checkNFTHeart({ collectionAddress, userAddress, nftId});
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 1,
  });
}

export default useCheckNFTHeart;