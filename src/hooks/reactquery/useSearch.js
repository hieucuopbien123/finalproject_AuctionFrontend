import { useQuery } from "@tanstack/react-query";
import { search } from "src/api/collection";

const useSearch = ({searchTerms}) => {
  return useQuery({
    queryKey: ["search", searchTerms], 
    queryFn: async () => {
      return await search({searchTerms});
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
    staleTime: Infinity,
  });
}

export default useSearch;