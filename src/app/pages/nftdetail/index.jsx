import { Box, Container } from "@mui/material";
import React from "react";
import AuctionActivities from "./AuctionActivities";
import AuctionFeat from "./AuctionFeat";
import { FailToLoad } from "src/app/components/error";
import PageLoading from "src/app/components/loading";
import useNFTDetail from "src/hooks/reactquery/useNFTDetail";
// import { useAccount } from "wagmi";

const NFTDetail = () => {
  const { data, isLoading, isError, error } = useNFTDetail();
  // const account = useAccount();

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }

  if(isLoading) {
    return <PageLoading/>
  }

  return (
    <Container maxWidth="xl">
      <AuctionFeat data={data}/>
      {/* {
        account?.address?.toLowerCase() &&
        <>
          <Box pt={4}/>
          <NFTCreateAuction data={data}/>
        </>
      } */}
      <Box pt={2}/>
      <AuctionActivities data={data}/>
      <Box pt={2}/>
      <Box pb={"50px"}/>
    </Container>
  )
}

export default NFTDetail;