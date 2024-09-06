import { Box, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import { useState } from "react";
import NFTInfo from "./NFTInfo";
import NFTOwner from "./NFTOwner";
import NFTTransfer from "./NFTTransfer";

const NFTAction = ({data}) => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <Tabs value={currentTab} onChange={(e, newVal) => setCurrentTab(newVal)}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="NFT info" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={0}/>
        <Tab label="NFT owners" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={1}/>
        <Tab label="Transfers history" sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value={2}/>
      </Tabs>
      <Divider/>
      {currentTab == 0 && <NFTInfo data={data}/>}
      {currentTab == 1 && <NFTOwner data={data}/>}
      {currentTab == 2 && <NFTTransfer data={data}/>}
    </>
  )
}

export default NFTAction;