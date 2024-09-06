import React, { useEffect, useState, useTransition } from "react";
import SkeletonCards from "src/app/components/skeletoncards";
import { useInView } from "react-intersection-observer";
import { Box } from "@mui/material";
import { FailToLoad } from "src/app/components/error";
import useCollectionNFTs from "src/hooks/reactquery/useCollectionNFTs";
import NFTCard from "../../userdetail/usercollected/NFTCard";
import { getNFTName } from "../../userdetail/utils";
import { Empty } from "src/app/components/empty";

const CollectionList = ({ gridMode, searchTerms }) => {
  const { 
    data: collectionNFTs, error, hasNextPage, isError, isFetchingNextPage, fetchNextPage
  } = useCollectionNFTs();
  const [_, startTransition] = useTransition();
  const [isAutoFetching, setAutoFetching] = useState(false);
  const { ref, inView } = useInView();
  useEffect(() => {
    let timerId;
    if (inView && isAutoFetching == false) {    
      setAutoFetching(true);
      fetchNextPage();
    } else if(isAutoFetching == true) {
      timerId = setTimeout(() => {
        setAutoFetching(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timerId);
    }
  }, [inView, fetchNextPage, isAutoFetching]);

  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [isFiltering, setIsFiltering] = useState(true);
  useEffect(() => {
    if(collectionNFTs){
      startTransition(() => {
        let tempFiltered = [];
        collectionNFTs?.pages?.map((page) => {
          page.data.map((data) => {
            if(
              !searchTerms || 
              (
                !!searchTerms && 
                (
                  getNFTName(data)?.toLowerCase()?.includes(searchTerms.toLowerCase()) || 
                  data?.token_id?.toLowerCase()?.includes(searchTerms.toLowerCase()) ||
                  data?.token_address?.toLowerCase()?.includes(searchTerms.toLowerCase()) ||
                  data?.contract_type?.toLowerCase()?.includes(searchTerms.toLowerCase()) ||
                  data?.symbol?.toLowerCase()?.includes(searchTerms.toLowerCase())
                )
              )
            ){
              tempFiltered.push(data);
            }
          })
        });
        setFilteredNFTs(tempFiltered);
        setIsFiltering(false);
      });
    }
  }, [searchTerms, collectionNFTs]);
  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  if(isFiltering) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${(gridMode == 0 ? "250px" : "180px")}, 1fr))`,
        gap: "13px"
      }}>
        <SkeletonCards gridMode={gridMode}/>
      </div>
    )
  }
  if((filteredNFTs?.length ?? 0) <= 0 && !hasNextPage){
    return <Box pt={2} pb={6}>
      <Empty title={"There is no NFTs!"}/>
    </Box>
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${(gridMode == 0 ? "250px" : "180px")}, 1fr))`,
      gap: "13px"
    }}>
      {
        filteredNFTs.map((data, i) => {
          return (
            <Box maxWidth={gridMode == 0 ? "290px" : "200px"} key={`${data.token_address}_${data.token_id}`}>
              <NFTCard data={data} gridMode={gridMode} bulkChosen={[]} setBulkChosen={() => {}}/>
            </Box>
          )
        })
      }
      {
        hasNextPage && (
          <>
            {
              (isFetchingNextPage || isAutoFetching) ? (
                <SkeletonCards gridMode={gridMode}/>
              ) : (
                <>
                  <div ref={ref}></div>
                </>
              )
            }
          </>
        )
      }
    </div>
  )
};

export default CollectionList;