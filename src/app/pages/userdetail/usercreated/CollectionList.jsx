import { Box } from "@mui/material";
import React, { useEffect, useState, useTransition } from "react";
import useAuctions from "src/hooks/reactquery/useAuctions";
import { useInView } from "react-intersection-observer";
import SkeletonCards from "src/app/components/skeletoncards";
import { useParams } from "react-router-dom";
import VickreyCard from "../../auctiontype/VickreyCard";
import EnglishCard from "../../auctiontype/EnglishCard";
import DutchCard from "../../auctiontype/DutchCard";
import SealedBidV1Card from "../../auctiontype/SealedBidV1Card";
import { useDebounce } from "@uidotdev/usehooks";
import { FailToLoad } from "src/app/components/error";
import { Empty } from "src/app/components/empty";
import SealedBidV2Card from "../../auctiontype/SealedBidV2Card";

const CollectionList = ({ collectionAddress, gridMode, searchTerms, account, auctionTypeFilter, status }) => {
  const debouncedCollectionAddress = useDebounce(collectionAddress, 500);
  const debouncedSearchTerms = useDebounce(searchTerms, 500);
  const debouncedAuctionType = useDebounce(auctionTypeFilter, 500);
  const { userAddress } = useParams();
  const { data: userCreatedAuction, error, isError, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } 
    = useAuctions({
      collectionAddresses: debouncedCollectionAddress?.map(c => c.address),
      userAddress: [userAddress],
      searchTerms: debouncedSearchTerms ?? "",
      auctionType: debouncedAuctionType,
      status
    });
  const [isPending, startTransition] = useTransition();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const [filteredAuctions, setFilteredAuctions] = useState([]);
  useEffect(() => {
    startTransition(() => {
      setFilteredAuctions(userCreatedAuction?.pages?.map((page) => page.data)?.flat() ?? []);
    });
  }, [userCreatedAuction]);

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  if(isLoading || isPending) {
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
  if((filteredAuctions?.length ?? 0) <= 0){
    return <Box pt={2}>
      <Empty title={"There is no ongoing auction you created!"}/>
    </Box>
  }
  
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${(gridMode == 0 ? "250px" : "180px")}, 1fr))`,
      gap: "13px"
    }}>
      {
        filteredAuctions.map((da) => {
          return (
            <Box maxWidth={"290px"} key={`${da.auctionAddress}`}>
              {
                (da.auctionType == "0") &&
                <EnglishCard data={da} gridMode={gridMode}/>
              }
              {
                (da.auctionType == "1") &&
                <VickreyCard data={da} gridMode={gridMode}/>
              }
              {
                (da.auctionType == "2") &&
                <DutchCard data={da} gridMode={gridMode} account={account}/>
              }
              {
                (da.auctionType == "3") &&
                <SealedBidV1Card data={da} gridMode={gridMode}/>
              }
              {
                (da.auctionType == "4") &&
                <SealedBidV2Card data={da} gridMode={gridMode}/>
              }
            </Box>
          )
        })
      }
      {
        hasNextPage && (
          <>
            {
              isFetchingNextPage ? (
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
}

export default CollectionList;