import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import toast from "react-hot-toast";
import { updateBidAuction } from "src/api/auction";
import VickreyBidAction from "src/app/components/auctionaction/VickreyBidAction";
import { useAccount } from "wagmi";
import { walletClient } from 'src/api/contracts/callconfig';
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";

const VickreyCardBidDialog = ({ bidDialogIsOpen, openBidDialog, data }) => {
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
        <Typography>Vickrey auction detail</Typography>
        <Box py={1}/>
        <VickreyBidAction data={data} callback={() => openBidDialog(false)} 
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
      </DialogContent>
    </Dialog>
  )
}

export default VickreyCardBidDialog;