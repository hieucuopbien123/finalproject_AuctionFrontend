import { Container, Divider, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import CollectionDetailNFT from "./CollectionDetailNFT";
import CollectionDetailAuction from "./CollectionDetailAuction";

const CollectionTabs = () => {
  const [userTab, setUserTab] = useState("0");
  return (
    <>
      <Container maxWidth="xxl">
        <Tabs
          value={userTab}
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, v) => setUserTab(v)}
        >
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="0" label="NFTs"/>
          <Tab sx={{fontSize: "16px", fontWeight: "bold", fontFamily: "Poppins"}} value="1" label="Auctions"/>
        </Tabs>
      </Container>
      <Divider/>
      { userTab == "0" && <CollectionDetailNFT/> }
      { userTab == "1" && <CollectionDetailAuction/> }
    </>
  )
}

export default CollectionTabs;
