import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";
import DutchActionProps from "./DutchActionProps";
import DutchBidAction from "src/app/components/auctionaction/DutchBidAction";
import DutchCancelAction from "src/app/components/auctionaction/DutchCancelAction";
import { Box } from "@mui/material";
import useDutchTimer from "src/hooks/auction/useDutchTimer";

const DutchAction = ({data, currentNFT, triggerRefetchAction}) => {
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  const { currentPrice, currentStep } = useDutchTimer({data});
  return (
    <>
      {
        data.status == 0 &&
        <>
          {
            !!account?.address &&
            account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
            Date.now()/1000 >= data.startTime && data.status == 0 &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <DutchBidAction data={data} price={currentPrice} account={account} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <DutchCancelAction data={data} account={account} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
        </>
      }
      <DutchActionProps data={data} currentStep={currentStep} currentNFT={currentNFT}/>
    </>
  )
}

export default DutchAction;