import React, { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import Popover from '@mui/material/Popover';
import { Box, Button, IconButton } from "@mui/material";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "src/context/useAppContext";

const NFTCardPopup = ({data, openDialog, setBulkChosen, checked}) => {
  const [anchor, setAnchor] = useState(null);
  const { colorMode: { currentMode } } = useAppContext();
  const handleClick = (event) => {
    setAnchor(anchor ? null : event.target);
  };
  const handleClose = () => {
    setAnchor(null);
  };
  useEffect(() => {
    setAnchor(null);
  }, [checked]);
  const navigate = useNavigate();
  const account = useAccount();
  return (
    <>
      <IconButton onClick={handleClick}>
        <RxDotsHorizontal fontSize={"large"} color={currentMode == "dark" ? "#f8f8f3" : "blue"}/>
      </IconButton>
      <Popover anchorEl={anchor} open={Boolean(anchor) && checked != true} onClose={handleClose}
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
            navigate(`/nftdetail/${data.token_address}/${data.token_id}`);
          }}>View details</Button>
          {
            account?.address?.toLowerCase() == data.owner_of?.toLowerCase() &&
            <Button sx={{fontFamily: "Poppins", fontWeight: "bolder"}} onClick={() => {
              openDialog(true); setBulkChosen([]);
            }}>Create new auction</Button>
          }
        </Box>
      </Popover>
    </>
  )
}

export default NFTCardPopup;