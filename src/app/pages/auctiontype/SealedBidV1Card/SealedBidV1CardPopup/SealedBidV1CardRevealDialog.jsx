import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import SealedBidV1RevealAction from "src/app/components/auctionaction/SealedBidV1RevealAction";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";

const SealedBidV1CardRevealDialog = ({ revealDialogIsOpen, openRevealDialog, data }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={revealDialogIsOpen}
      onClose={() => openRevealDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress} arrow enterDelay={1000} enterNextDelay={500} placement="top" fontFamily={"Poppins"}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Reveal auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openRevealDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SealedBidV1RevealAction data={data} callback={() => openRevealDialog(false)}/>
      </DialogContent>
    </Dialog>
  )
}

export default SealedBidV1CardRevealDialog;