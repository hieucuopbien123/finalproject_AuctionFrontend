import { Box, Button, IconButton, Popover } from "@mui/material";
import React, { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";

const EnglishCardPopup = ({openCancelDialog, openBidDialog, openEditDialog, openFinalizeDialog, data}) => {
  const [anchor, setAnchor] = useState(null);
  const navigate = useNavigate();
  const { colorMode: { currentMode } } = useAppContext();
  const handleClick = (event) => {
    setAnchor(anchor ? null : event.target);
  };
  const handleClose = () => {
    setAnchor(null);
  };
  const account = useAccount();
  
  return (
    <>
      <IconButton onClick={handleClick}>
        <RxDotsHorizontal fontSize={"large"} color={currentMode == "dark" ? "#f8f8f3" : "blue"}/>
      </IconButton>
      <Popover anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        elevation={3}
        disableScrollLock
      >
        <Box p={0.5} onMouseLeave={handleClose} display={"flex"} flexDirection={"column"} gap={"2px"}>
          <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => {
            if(data.auctionAddress && data.auctionAddress != "0x0000000000000000000000000000000000000000")
            navigate(`/auctiondetail/${data.auctionAddress}`);
          }}>View details</Button>
          {
            data.status == 0 &&
            <>
              {
                !!account?.address &&
                account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
                data.highestBidder.toLowerCase() != account?.address?.toLowerCase() &&
                Date.now()/1000 <= data.endTime - 5 &&
                Date.now()/1000 >= data.startTime &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openBidDialog(true)}>Bid auction</Button>
              }
              {
                account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
                data.highestBidder == "0x0000000000000000000000000000000000000000" &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openCancelDialog(true)}>Cancel auction</Button>
              }
              {
                account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
                data.highestBidder == "0x0000000000000000000000000000000000000000" &&
                Date.now()/1000 < data.endTime &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openEditDialog(true)}>Edit auction</Button>
              }
              {
                data.bidStep != "0" && data.status == 0 && Date.now()/1000 >= data.endTime && 
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openFinalizeDialog(true)}>Finalize auction</Button>
              }
            </>
          }
        </Box>
      </Popover>
    </>
  )
}

export default EnglishCardPopup;