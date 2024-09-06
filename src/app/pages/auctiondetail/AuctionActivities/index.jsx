import React from "react";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import AuctionActivity from "src/app/components/auctionactivity";
import useOneAuctionTrades from "src/hooks/reactquery/useOneAuctionTrades";

const AuctionActivities = () => {
  return (
    <Box pt={1}>
      <Tabs value={0}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Auction activity" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={0}/>
      </Tabs>
      <Divider/>
      <AuctionActivity useTrade={useOneAuctionTrades}/>
    </Box>
  )
}

export default AuctionActivities;