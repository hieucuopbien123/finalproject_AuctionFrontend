import { Box, Container } from "@mui/material";
import React from "react";
import AuctionActivities from "./AuctionActivities";
import AuctionFeat from "./AuctionFeat";
import useAuctionDetail from "src/hooks/reactquery/useAuctionDetails";
import { FailToLoad } from "src/app/components/error";
import PageLoading from "src/app/components/loading";
import { useParams } from "react-router-dom";

const AuctionDetail = () => {
  const { auctionAddress } = useParams();
  const { data, isLoading, isError, error } = useAuctionDetail({auctionAddress});

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }

  if(isLoading) {
    return <PageLoading/>
  }

  return (
    <Container maxWidth="xl" className="animate__animated animate__fadeIn">
      <AuctionFeat data={data}/>
      <Box pt={1}/>
      <AuctionActivities data={data}/>
      <Box pt={2}/>
      <Box pb={"50px"}/>
    </Container>
  )
}

export default AuctionDetail;