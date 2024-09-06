import { Box } from "@mui/material";
import React from "react";
import AuctionHeader from "./AuctionHeader";
import AuctionTypeDetail from "./AuctionTypeDetail";
import { useAccount } from "wagmi";
import { useParams } from "react-router-dom";
import ArchiveAuction from "./ArchiveAuction";

const AuctionType = () => {
  const account = useAccount();
  const { auctionType } = useParams();

  if(auctionType == "1000") {
    return <ArchiveAuction/>;
  }

  return (
    <Box className="animate__animated animate__fadeIn" pt={2} pb="42px">
      <AuctionHeader/>
      <Box py={2}/>
      <AuctionTypeDetail account={account}/>
    </Box>
  )
}

export default AuctionType;