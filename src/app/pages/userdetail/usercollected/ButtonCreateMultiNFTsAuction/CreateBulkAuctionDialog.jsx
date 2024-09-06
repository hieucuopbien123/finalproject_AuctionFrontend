import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import CreateBulkAuctionDialogContent from "./CreateBulkAuctionDialogContent";

const CreateBulkAuctionDialog = (
  {data, dialogOpen, setDialogOpen, writeContract, isLoading, setAuctionType, setBulkChosen}
) => {
  const theme = useTheme();
  return (
    <>
      <Dialog
        maxWidth="md"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth={true}
        disableScrollLock
      >
        <DialogTitle textAlign="center" position={"relative"} sx={{px: 1}}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize" px={4}>
            Create multi-nfts auction
          </Typography>
          <IconButton sx={{position: "absolute", right: 10, top: 9}} onClick={() => setDialogOpen(false)}>
            <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {
            <CreateBulkAuctionDialogContent
              {...{data, dialogOpen, setDialogOpen, writeContract, isLoading, setAuctionType, setBulkChosen}}
            />
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateBulkAuctionDialog;