import { Box } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";
import SealedBidV2ActionProps from "./SealedBidV2ActionProps";
import SealedBidV2BidAction from "src/app/components/auctionaction/SealedBidV2BidAction";
import SealedBidV2CancelAction from "src/app/components/auctionaction/SealedBidV2CancelAction";
import SealedBidV2RevealAction from "src/app/components/auctionaction/SealedBidV2RevealAction";
import SealedBidV2ClaimAction from "src/app/components/auctionaction/SealedBidV2ClaimAction";

const SealedBidV2Action = ({data, currentNFT, triggerRefetchAction}) => {
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <>
      {
        data.status == 0 &&
        <>
          {
            !!account?.address &&
            account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
            Date.now()/1000 <= data.endTime - 3 &&
            Date.now()/1000 >= data.startTime &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <SealedBidV2BidAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            !!account?.address &&
            account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
            (
              data.bidStep == 0 || 
              (data.revealStep == 0 && Date.now()/1000 > data.endTime + data.revealDuration)
            ) &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <SealedBidV2CancelAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            !!account?.address &&
            account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
            (
              Date.now()/1000 > data.endTime && (
                data.revealStep == 0 || ( Date.now()/1000 <= data.endTime + data.revealDuration )
              )
            ) &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <SealedBidV2RevealAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            !!account?.address &&
            Date.now()/1000 >= data.endTime + data.revealDuration &&
            data.revealStep > 0 &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <SealedBidV2ClaimAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
        </>
      }
      <SealedBidV2ActionProps data={data} currentNFT={currentNFT}/>
    </>
  )
}

export default SealedBidV2Action;