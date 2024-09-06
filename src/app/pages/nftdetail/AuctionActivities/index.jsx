import React from "react";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import AuctionActivity from "src/app/components/auctionactivity";
import useNFTDetailTrades from "src/hooks/reactquery/useNFTDetailTrades";

const AuctionActivities = ({data}) => {
  return (
    <Box pt={1}>
      <Tabs value={0}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Auction activity" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={0}/>
      </Tabs>
      <Divider/>
      <AuctionActivity useTrade={useNFTDetailTrades}/>
    </Box>
  )
}

export default AuctionActivities;