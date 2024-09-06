import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import CloseIcon from '@mui/icons-material/Close';
import EnglishEditAction from "src/app/components/auctionaction/EnglishEditAction";
import CustomTooltip from "src/app/components/tooltip";

const EnglishCardEditDialog = ({ editDialogIsOpen, openEditDialog, data }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={editDialogIsOpen}
      onClose={() => openEditDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Edit auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openEditDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <EnglishEditAction data={data} callback={() => openEditDialog(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default EnglishCardEditDialog;