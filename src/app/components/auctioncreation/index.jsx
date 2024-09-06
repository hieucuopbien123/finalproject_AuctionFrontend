import { Box, Tab, Tabs, styled } from "@mui/material";
import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import EnglishAuctionCreation from "./EnglishAuctionCreation";
import VickreyAuctionCreation from "./VickreyAuctionCreation";
import DutchAuctionCreation from "./DutchAuctionCreation";
import SealedBidAuctionV1Creation from "./SealedBidAuctionV1Creation";
import SealedBidAuctionV2Creation from "./SealedBidAuctionV2Creation";

const StyledTab = styled(Tab)({
  "&.MuiTab-root": {
    fontFamily: "Poppins",
    fontWeight: "bold",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: 6,
    height: "2px"
  },
});

const tabs = [
  {
    value: "0",
    Tag: EnglishAuctionCreation,
  },
  {
    value: "1",
    Tag: VickreyAuctionCreation,
  },
  {
    value: "2",
    Tag: DutchAuctionCreation,
  },
  {
    value: "3",
    Tag: SealedBidAuctionV1Creation,
  },
  {
    value: "4",
    Tag: SealedBidAuctionV2Creation,
  },
]

const AuctionCreation = ({nftAmount, data, writeContract, isLoading, setAuctionType, callback}) => {
  const [value, setValue] = useState("0");
  const handleChangeTab = (_, newValue) => {
    setValue(newValue);
  };
  return (
    <Box display="flex" flexDirection="column" height={"100%"}>
      <TabContext value={value}>
        <Tabs variant="scrollable" scrollButtons allowScrollButtonsMobile  value={value} onChange={handleChangeTab}>
          <StyledTab label={"English auction"} value={"0"} className="fontNomSize"/>
          <StyledTab label={"Vickrey auction"} value={"1"} className="fontNomSize"/>
          <StyledTab label={"Dutch auction"} value={"2"} className="fontNomSize"/>
          <StyledTab label={"Sealedbid auction v1"} value={"3"} className="fontNomSize"/>
          <StyledTab label={"Sealedbid auction v2"} value={"4"} className="fontNomSize"/>
        </Tabs>
        {
          tabs.map((t, index) => (
          <TabPanel sx={{p: 0}} value={t.value} style={{flexGrow: 1}} key={index}>
            <t.Tag nftAmount={nftAmount} data={data} writeContract={writeContract} isLoading={isLoading} 
              callback={() => {
                setAuctionType(t.value);
                if(callback) callback();
              }}
            />
          </TabPanel>
          ))
        }
      </TabContext>
    </Box>
  )
}

export default AuctionCreation;