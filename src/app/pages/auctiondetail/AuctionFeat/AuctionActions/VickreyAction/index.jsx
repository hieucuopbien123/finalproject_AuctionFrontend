import { Box } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";
import VickreyActionProps from "./VickreyActionProps";
import VickreyBidAction from "src/app/components/auctionaction/VickreyBidAction";
import { updateBidAuction } from "src/api/auction";
import VickreyRevealAction from "src/app/components/auctionaction/VickreyRevealAction";
import VickreyClaimAction from "src/app/components/auctionaction/VickreyClaimAction";
import { walletClient } from "src/api/contracts/callconfig";
import toast from "react-hot-toast";
import VickreyStartRevealAction from "src/app/components/auctionaction/VickreyStartRevealAction";
import CheckProof from "src/app/components/auctionaction/CheckProof";
import VickreyRevealBatch from "src/app/components/auctionaction/VickreyRevealBatch";

const VickreyAction = ({data, currentNFT, triggerRefetchAction}) => {
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <>
      {
        !!account?.address &&
        data.endTime < Date.now()/1000 &&
        <>
          <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
            <VickreyRevealAction data={data} callback={() => {}}/>
          </Box>
          <Box pt={3}/>
        </>
      }
      {
        !!account?.address &&
        data.endTime < Date.now()/1000 && data.startTime == "0" &&
        <>
          <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
            <VickreyStartRevealAction data={data} callback={() => {}}/>
          </Box>
          <Box pt={3}/>
        </>
      }
      {
        !!account?.address &&
        data.endTime < Date.now()/1000 &&
        (data.startTime == "0" || data.startTime + data.revealDuration > Date.now()/1000) &&
        <>
          <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
            <VickreyRevealBatch data={data} callback={() => {}}/>
          </Box>
          <Box pt={3}/>
        </>
      }
      <Box p={2} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
        <CheckProof/>
      </Box>
      <Box pt={3}/>
      {
        data.status == 0 &&
        <>
          {
            !!account?.address &&
            account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
            data.endTime > Date.now()/1000 &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <VickreyBidAction data={data} 
                  // callbackLater={async () => {
                  //   if(account.address){
                  //     const sig = await walletClient.signMessage({ 
                  //       account,
                  //       message: `Verify bidded user`,
                  //     });
                  //     updateBidAuction({auctionAddress: data.auctionAddress, userAddress: account.address, auctionType: 1, sig})
                  //     .then(response => { 
                  //       console.log("Update success::", response.data);
                  //     })
                  //     .catch(error => { toast.error(error?.response?.data?.error?.slice(0, 50) ?? error.message.slice(0, 50)); });
                  //   }
                  // }}
                />
              </Box>
              <Box pt={3}/>
            </>
          }
          {
            !!account?.address &&
            (account?.address?.toLowerCase() == data.topBidder?.toLowerCase() || account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() ) &&
            data.startTime != 0 && data.status == 0 &&
            data.startTime + data.revealDuration < Date.now()/1000 &&
            <>
              <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
                <VickreyClaimAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
        </>
      }
      <VickreyActionProps data={data} currentNFT={currentNFT}/>
    </>
  )
}

export default VickreyAction;