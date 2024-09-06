import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";
import SealedBidV2ClaimAction from "src/app/components/auctionaction/SealedBidV2ClaimAction";

const SealedBidV2CardClaimDialog = ({ claimDialogIsOpen, openClaimDialog, data }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={claimDialogIsOpen}
      onClose={() => openClaimDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Claim auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openClaimDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SealedBidV2ClaimAction data={data} callback={() => openClaimDialog(false)}/>
      </DialogContent>
    </Dialog>
  )
}

export default SealedBidV2CardClaimDialog;
