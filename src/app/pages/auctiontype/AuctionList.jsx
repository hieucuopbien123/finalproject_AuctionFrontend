import { Box } from "@mui/material";
import React, { useEffect, useState, useTransition } from "react";
import useAuctions from "src/hooks/reactquery/useAuctions";
import { useInView } from "react-intersection-observer";
import SkeletonCards from "src/app/components/skeletoncards";
import { useParams } from "react-router-dom";
import VickreyCard from "./VickreyCard";
import DutchCard from "./DutchCard";
import EnglishCard from "./EnglishCard";
import SealedBidV1Card from "./SealedBidV1Card";
import { FailToLoad } from "src/app/components/error";
import { useDebounce } from "@uidotdev/usehooks";
import { Empty } from "src/app/components/empty";
import SealedBidV2Card from "./SealedBidV2Card";

const AuctionList = ({ collectionAddress, gridMode, currentCreator, searchTerms, account }) => {
  const { auctionType } = useParams();
  const debouncedCollectionAddress = useDebounce(collectionAddress, 500);
  const debouncedCreatorAddress = useDebounce(currentCreator, 500);
  const debouncedSearchTerms = useDebounce(searchTerms, 500);
  const { data: auctions, isError, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAuctions({
    auctionType: [parseInt(auctionType)], 
    collectionAddresses: debouncedCollectionAddress.map(c => c.address), 
    userAddress: debouncedCreatorAddress.map(c => c.address),
    searchTerms: debouncedSearchTerms
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
      setFilteredAuctions(auctions?.pages?.map((page) => page.data)?.flat() ?? []);
    });
  }, [auctions]);

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
      <Empty title={"There is no ongoing auction!"}/>
    </Box>
  }

  return (
    <>
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
    </>
  )
}

export default AuctionList;