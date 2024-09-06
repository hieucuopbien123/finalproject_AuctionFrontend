import { Box } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";
import SealedBidV1ActionProps from "./SealedBidV1ActionProps";
import SealedBidV1BidAction from "src/app/components/auctionaction/SealedBidV1BidAction";
import { updateBidAuction } from "src/api/auction";
import SealedBidV1RevealAction from "src/app/components/auctionaction/SealedBidV1RevealAction";
import SealedBidV1ClaimAction from "src/app/components/auctionaction/SealedBidV1ClaimAction";
import SealedBidV1StartRevealAction from "src/app/components/auctionaction/SealedBidV1StartRevealAction";
import CheckProof from "src/app/components/auctionaction/CheckProof";
import SealedBidV1RevealBatch from "src/app/components/auctionaction/SealedBidV1RevealBatch";
import { walletClient } from "src/api/contracts/callconfig";
import toast from "react-hot-toast";

const SealedBidV1Action = ({data, currentNFT, triggerRefetchAction}) => {
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <>
      <Box pt={1.5}/>
      {
        !!account?.address &&
        data.endTime < Date.now()/1000 &&
        <>
          <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
            <SealedBidV1RevealAction data={data} callback={() => {}}/>
          </Box>
          <Box pt={3}/>
        </>
      }
      {
        !!account?.address &&
        data.endTime < Date.now()/1000 && data.startTime == "0" &&
        <>
          <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
            <SealedBidV1StartRevealAction data={data} callback={() => {}}/>
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
            <SealedBidV1RevealBatch data={data} callback={() => {}}/>
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
              <Box display="flex" justifyContent={"center"}>
                <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"} maxWidth="600px" flexGrow={1}>
                  <SealedBidV1BidAction data={data} 
                    // callbackLater={async () => {
                    //   if(account.address){
                    //     const sig = await walletClient.signMessage({ 
                    //       account,
                    //       message: `Verify bidded user`,
                    //     });
                    //     updateBidAuction({auctionAddress: data.auctionAddress, userAddress: account.address, auctionType: 3, sig})
                    //     .then(response => { 
                    //       console.log("Update success::", response.data);
                    //     })
                    //     .catch(error => { toast.error(error?.response?.data?.error?.slice(0, 50) ?? error.message.slice(0, 50)); });
                    //   }
                    // }}
                  />
                </Box>
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
                <SealedBidV1ClaimAction data={data} callback={() => {}}/>
              </Box>
              <Box pt={3}/>
            </>
          }
        </>
      }
      <SealedBidV1ActionProps data={data} currentNFT={currentNFT}/>
    </>
  )
}

export default SealedBidV1Action;