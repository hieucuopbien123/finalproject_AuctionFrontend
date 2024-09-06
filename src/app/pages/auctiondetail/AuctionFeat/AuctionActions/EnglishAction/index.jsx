import { Box } from "@mui/material";
import React from "react";
import EnglishBidAction from "src/app/components/auctionaction/EnglishBidAction";
import EnglishCancelAction from "src/app/components/auctionaction/EnglishCancelAction";
import EnglishClaimAction from "src/app/components/auctionaction/EnglishClaimAction";
import EnglishEditAction from "src/app/components/auctionaction/EnglishEditAction";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";
import EnglishActionProps from "./EnglishActionProps";

const EnglishAction = ({data, currentNFT}) => {
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <>
      {
        data.status == 0 &&
        <>
          {
            account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
            data.highestBidder == "0x0000000000000000000000000000000000000000" &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <EnglishCancelAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            !!account?.address &&
            account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
            data.highestBidder.toLowerCase() != account?.address?.toLowerCase() &&
            Date.now()/1000 <= data.endTime - 5 &&
            Date.now()/1000 >= data.startTime &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <EnglishBidAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
            data.highestBidder == "0x0000000000000000000000000000000000000000" &&
            Date.now()/1000 < data.endTime &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <EnglishEditAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            data.bidStep != "0" && data.status == 0 && Date.now()/1000 >= data.endTime && 
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <EnglishClaimAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
        </>
      }
      <EnglishActionProps data={data} currentNFT={currentNFT}/>
    </>
  )
}

export default EnglishAction;