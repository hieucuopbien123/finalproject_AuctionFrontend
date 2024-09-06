import { Box, Button, IconButton, Popover } from "@mui/material";
import React, { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/useAppContext";
import { useAccount } from "wagmi";

const SealedBidV2CardPopup = ({openBidDialog, openCancelDialog, openRevealDialog, openClaimDialog, data}) => {
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
            navigate(`/auctiondetail/${data.auctionAddress}`);
          }}>View details</Button>
          {
            data.status == 0 &&
            <>
              {
                !!account?.address &&
                account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
                Date.now()/1000 <= data.endTime - 3 &&
                Date.now()/1000 >= data.startTime &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openBidDialog(true)}>Bid or edit price</Button>
              }
              {
                !!account?.address &&
                account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() &&
                (
                  data.bidStep == 0 || 
                  (data.revealStep == 0 && Date.now()/1000 > data.endTime + data.revealDuration)
                ) &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openCancelDialog(true)}>Cancel auction</Button>
              }
              {
                !!account?.address &&
                account?.address?.toLowerCase() != data.auctionCreator?.toLowerCase() &&
                (
                  Date.now()/1000 > data.endTime && (
                    data.revealStep == 0 || ( Date.now()/1000 <= data.endTime + data.revealDuration )
                  )
                ) &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openRevealDialog(true)}>Reveal price</Button>
              }
              {
                !!account?.address &&
                Date.now()/1000 >= data.endTime + data.revealDuration &&
                data.revealStep > 0 &&
                <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => openClaimDialog(true)}>Claim win</Button>
              }
            </>
          }
        </Box>
      </Popover>
    </>
  )
}

export default SealedBidV2CardPopup;