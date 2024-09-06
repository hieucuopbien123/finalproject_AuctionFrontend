import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const Sealedv2Tut = () => {
  const theme = useTheme();
  return (
    <Box display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{backgroundColor: theme.palette.customBg, p: 3, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">01&nbsp;&nbsp;|&nbsp;&nbsp;Create Sealed bid v2 auction</Typography>
        <Box pt={1}/>
        <Box>
          <img style={{objectFit: "contain", maxWidth: "400px"}}
            src={"/sealedv2.jpeg"}
          />
          <Box pt={1}/>
          <Box display={"flex"} flexDirection={"column"} gap="10px">
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"STARTING BID" is the minimum price that users can bid.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"BID DURATION" and "REVEAL DURATION" is the duration of bid phase and reveal phase.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"START AFTER" is delay time auction in the sealed status.</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">02&nbsp;&nbsp;|&nbsp;&nbsp;Bid auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Anyone except bidder can bid or edit bid amount for the auction. You don't need to lock any token in this step.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            The bid amount will be kept secret. 
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">03&nbsp;&nbsp;|&nbsp;&nbsp;Reveal auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            If you bidded higher than the highest amount, you can reveal to actually lock token into the contracts in the reveal phase.
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            Users must approve (if ERC20) before revealing.
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">04&nbsp;&nbsp;|&nbsp;&nbsp;Cancel and finalize auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            Only auction owner can cancel the auction if no one has bidded yet or auction is ended but no one has revealed yet.
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            Anyone can finalize auction if someone has bidded it and the reveal phase is finished.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Sealedv2Tut;