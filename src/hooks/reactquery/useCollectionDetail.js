import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCollectionDetail } from "src/api/collection";
import { useAppContext } from "src/context/useAppContext";

const useCollectionDetail = () => {
  const { address } = useParams();
  const { refetchQuery } = useAppContext();
  return useQuery({
    queryKey: ["collectiondetail", address],
    queryFn: async () => {
      return await getCollectionDetail({ address });
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: () => refetchQuery ? 5000 : false,
    retry: 1
  });
}

export default useCollectionDetail;