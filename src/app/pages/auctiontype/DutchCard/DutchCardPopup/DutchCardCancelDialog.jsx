import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import DutchCancelAction from "src/app/components/auctionaction/DutchCancelAction";
import CloseIcon from '@mui/icons-material/Close';
import CustomTooltip from "src/app/components/tooltip";

const DutchCardCancelDialog = ({ cancelDialogIsOpen, openCancelDialog, data, account }) => {
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
            Confirm to cancel auction {formatAddress(data.auctionAddress)}
          </Typography>
        </CustomTooltip>
        <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => openCancelDialog(false)}>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap="20px" alignItems={"center"} justifyContent={"center"}>
          <Typography className="" sx={{textAlign: "center", fontFamily: "Poppins"}}>Are you sure want to cancel this auction?</Typography>
          <Box display={"flex"} gap="10px">
            <DutchCancelAction data={data} account={account} callback={() => openCancelDialog(false)}/>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default DutchCardCancelDialog;