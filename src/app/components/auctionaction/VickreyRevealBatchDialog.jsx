import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import VickreyRevealBatchDialogContent from "./VickreyRevealBatchDialogContent";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "../tooltip";

const VickreyRevealBatchDialog = ({data, dialogIsOpen, openDialog, writeContract, isLoading}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={dialogIsOpen}
      onClose={() => openDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Reveal batch auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <VickreyRevealBatchDialogContent {...{data, writeContract, isLoadingX: isLoading}}/>
      </DialogContent>
    </Dialog>
  )
}

export default VickreyRevealBatchDialog;