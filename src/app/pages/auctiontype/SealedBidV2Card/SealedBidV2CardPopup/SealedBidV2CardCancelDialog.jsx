import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";
import SealedBidV2CancelAction from "src/app/components/auctionaction/SealedBidV2CancelAction";

const SealedBidV2CardCancelDialog = ({ cancelDialogIsOpen, openCancelDialog, data }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={cancelDialogIsOpen}
      onClose={() => openCancelDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Cancel auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openCancelDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SealedBidV2CancelAction data={data} callback={() => openCancelDialog(false)}/>
      </DialogContent>
    </Dialog>
  )
}

export default SealedBidV2CardCancelDialog;
