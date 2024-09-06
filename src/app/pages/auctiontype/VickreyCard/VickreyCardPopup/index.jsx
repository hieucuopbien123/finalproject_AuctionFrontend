import { Box, Button, IconButton, Popover } from "@mui/material";
import React, { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";

const VickreyCardPopup = ({openBidDialog, openRevealDialog, openClaimDialog, data}) => {
  const [anchor, setAnchor] = useState(null);
  const { colorMode: { currentMode } } = useAppContext();
  const navigate = useNavigate();
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
            !!account?.address &&
            data.endTime < Date.now()/1000 &&
            <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openRevealDialog(true)}>{
              (data.startTime != "0" && data.startTime + data.revealDuration <= Date.now()/1000) ?
                "Late reveal" :
                "Reveal"
            }
            </Button>
          }
          {
            data.status == 0 &&
            <>
              {
                !!account?.address &&
                account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
                data.endTime > Date.now()/1000 &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openBidDialog(true)}>Bid auction</Button>
              }
              {
                !!account?.address &&
                (account?.address?.toLowerCase() == data.topBidder?.toLowerCase() || account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase()) &&
                data.startTime != 0 && data.status == 0 &&
                data.startTime + data.revealDuration < Date.now()/1000 &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openClaimDialog(true)}>{
                  account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() ? "Finalize" : "Claim win"
                }</Button>
              }
            </>
          }
        </Box>
      </Popover>
    </>
  )
}

export default VickreyCardPopup;