import { useQuery } from "@tanstack/react-query";
import { getCollectionList } from "src/api/collection";
import { useAppContext } from "src/context/useAppContext";

const useCollectionList = ({first, skip}) => {
  const { refetchQuery } = useAppContext();
  return useQuery({
    queryKey: ["collectionlist", first, skip],
    queryFn: async () => {
      return await getCollectionList({ first, skip});
    },
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
  });
}

export default useCollectionList;