import { Box } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import EnglishActionHeader from "./EnglishAction/EnglishActionHeader";
import EnglishAction from "./EnglishAction";
import VickreyActionHeader from "./VickreyAction/VickreyActionHeader";
import VickreyAction from "./VickreyAction";
import DutchActionHeader from "./DutchAction/DutchActionHeader";
import DutchAction from "./DutchAction";
import SealedBidV1Action from "./SealedBidV1Action";
import SealedBidV1ActionHeader from "./SealedBidV1Action/SealedBidV1ActionHeader";
import SealedBidV2Action from "./SealedBidV2Action";
import SealedBidV2ActionHeader from "./SealedBidV2Action/SealedBidV2ActionHeader";
import { useState } from "react";

const AuctionActions = ({data, currentNFT}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const [triggerRefetchAction, setRefetchTrigger] = useState(false);
  return (
    <>
      <Box sx={{gridArea: "A"}} pt={5} px={5}>
        {
          (data.auctionType == "0") &&
          <EnglishActionHeader data={data} setRefetchTrigger={setRefetchTrigger}/>
        }
        {
          (data.auctionType == "1") &&
          <VickreyActionHeader data={data} setRefetchTrigger={setRefetchTrigger}/>
        }
        {
          (data.auctionType == "2") &&
          <DutchActionHeader data={data} setRefetchTrigger={setRefetchTrigger}/>
        }
        {
          (data.auctionType == "3") &&
          <SealedBidV1ActionHeader data={data} setRefetchTrigger={setRefetchTrigger}/>
        }
        {
          (data.auctionType == "4") &&
          <SealedBidV2ActionHeader data={data} setRefetchTrigger={setRefetchTrigger}/>
        }
      </Box>
      <Box sx={{gridArea: "C"}} pb={4} px={4} borderBottom={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
        {
          (data.auctionType == "0") &&
          <EnglishAction data={data} currentNFT={currentNFT} triggerRefetchAction={triggerRefetchAction}/>
        }
        {
          (data.auctionType == "1") &&
          <VickreyAction data={data} currentNFT={currentNFT} triggerRefetchAction={triggerRefetchAction}/>
        }
        {
          (data.auctionType == "2") &&
          <DutchAction data={data} currentNFT={currentNFT} triggerRefetchAction={triggerRefetchAction}/>
        }
        {
          (data.auctionType == "3") &&
          <SealedBidV1Action data={data} currentNFT={currentNFT} triggerRefetchAction={triggerRefetchAction}/>
        }
        {
          (data.auctionType == "4") &&
          <SealedBidV2Action data={data} currentNFT={currentNFT} triggerRefetchAction={triggerRefetchAction}/>
        }
      </Box>
    </>
  )
}

export default AuctionActions;