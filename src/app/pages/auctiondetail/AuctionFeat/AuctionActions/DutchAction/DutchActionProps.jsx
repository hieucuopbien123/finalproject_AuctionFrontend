import { Box, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import { useState } from "react";
import AuctionInfo from "./AuctionInfo";
import NFTInfo from "../NFTInfo";

const DutchActionProps = ({data, currentNFT, currentStep}) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <Tabs value={currentTab} onChange={(e, newVal) => setCurrentTab(newVal)}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Auction info" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={0}/>
        <Tab label="NFT info" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={1}/>
      </Tabs>
      <Divider/>
      <Box py={1.5}/>
      {currentTab == 0 && <AuctionInfo data={data} currentStep={currentStep}/>}
      {currentTab == 1 && <NFTInfo data={data} currentNFT={currentNFT}/>}
    </>
  )
}

export default DutchActionProps;