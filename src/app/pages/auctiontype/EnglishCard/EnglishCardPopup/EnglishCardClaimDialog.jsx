import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import CloseIcon from '@mui/icons-material/Close';
import EnglishClaimAction from "src/app/components/auctionaction/EnglishClaimAction";
import CustomTooltip from "src/app/components/tooltip";

const EnglishCardClaimDialog = ({ finalizeDialogIsOpen, openFinalizeDialog, data }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={finalizeDialogIsOpen}
      onClose={() => openFinalizeDialog(false)}
      fullWidth={true}
    >
      <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
        <CustomTooltip text={data.auctionAddress}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Confirm to claim auction for {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openFinalizeDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap="15px" alignItems={"center"} justifyContent={"center"} flexWrap={"wrap"}>
          <Typography sx={{textAlign: "center", fontFamily: "Poppins"}}>Are you sure want to finalize this auction?</Typography>
          <Box display={"flex"} gap="10px">
            <EnglishClaimAction data={data} callback={() => {openFinalizeDialog(false)}}/>
            <Button variant="outlined" fontFamily="Poppins" onClick={() => openFinalizeDialog(false)}>No</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EnglishCardClaimDialog;