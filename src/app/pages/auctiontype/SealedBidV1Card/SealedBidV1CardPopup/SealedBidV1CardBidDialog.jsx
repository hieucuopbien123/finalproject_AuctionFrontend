import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { convertSecondsToTime, formatAddress } from "src/utils";
import SealedBidV1BidAction from "src/app/components/auctionaction/SealedBidV1BidAction";
import { updateBidAuction } from "src/api/auction";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";

const SealedBidV1CardBidDialog = ({ bidDialogIsOpen, openBidDialog, data }) => {
  const account = useAccount();
  const theme = useTheme();
  return (
    <Dialog
      open={bidDialogIsOpen}
      onClose={() => openBidDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Bid auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openBidDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box display="flex" gap="10px" justifyContent={"space-between"}>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>AUCTION CREATOR</Typography>
            <CustomTooltip text={data.auctionCreator}>
              <Typography className="fontSmallSize" fontFamily={"Poppins"}>{account?.address?.toLowerCase() == data.auctionCreator.toLowerCase() ? "You" : formatAddress(data.auctionCreator)}</Typography>
            </CustomTooltip>
          </Box>
          <Box pt={1}/>
          <Box display="flex" gap="10px" justifyContent={"space-between"}>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>ENDTIME</Typography>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>{(new Date(data.endTime*1000)).toLocaleString()}</Typography>
          </Box>
          <Box pt={1}/>
          <Box display="flex" gap="10px" justifyContent={"space-between"}>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>STARING PRICE</Typography>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>{formatEther(data.startingPrice)} ETH</Typography>
          </Box>
          <Box pt={1}/>
          <Box display="flex" gap="10px" justifyContent={"space-between"}>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>REVEAL DURATION</Typography>
            <Typography className="fontSmallSize" fontFamily={"Poppins"}>{convertSecondsToTime(data.revealDuration)}</Typography>
          </Box>
        </Box>
        <Box pt={1}/>
        <SealedBidV1BidAction data={data} callback={() => openBidDialog(false)} 
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
      </DialogContent>
    </Dialog>
  )
}

export default SealedBidV1CardBidDialog;