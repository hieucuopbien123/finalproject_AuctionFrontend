import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import SealedBidV2BidAction from "src/app/components/auctionaction/SealedBidV2BidAction";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";

const SealedBidV2CardBidDialog = ({ bidDialogIsOpen, openBidDialog, data }) => {
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
            Bid or edit price for auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openBidDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SealedBidV2BidAction data={data} callback={() => openBidDialog(false)}/>
      </DialogContent>
    </Dialog>
  )
}

export default SealedBidV2CardBidDialog;