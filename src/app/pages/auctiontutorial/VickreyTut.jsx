import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const VickreyTut = () => {
  const theme = useTheme();
  return (
    <Box display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{backgroundColor: theme.palette.customBg, p: 3, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">01&nbsp;&nbsp;|&nbsp;&nbsp;Create Vickrey auction</Typography>
        <Box pt={1}/>
        <Box>
          <img style={{objectFit: "contain", maxWidth: "400px"}}
            src={"/vickrey.jpeg"}
          />
          <Box pt={1}/>
          <Box display={"flex"} flexDirection={"column"} gap="10px">
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"STARTING BID" is the minimum price that users can bid.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"BID DURATION" is the minimum bid duration time that users can bid.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"REVEAL DURATION" should be long to prevent bidders from lateReveal.</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">02&nbsp;&nbsp;|&nbsp;&nbsp;Bid auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Anyone can bid the auction.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            Before the actual bid, users need to save their proof to a file in order to hide their identity and bid amount. If this file is loss, users may lose their bid. After revealing, this file can be deleted.
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            We recommend that one address should only bid one time with the desired price you are willing to pay. You should not change the price or undo this until the auction ended to avoid unexpected behavior.
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">03&nbsp;&nbsp;|&nbsp;&nbsp;Reveal proof</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Proof is constructed of "&lt;auctionAddress&gt;_&lt;bidderAddress&gt;_&lt;bidAmount&gt;_&lt;randomPassword&gt;"</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            If you reveal proof after reveal phase is finished (late reveal), there will be a penalty, your amount will be slashed by: <br/>
            - You are highest bidder: topBid - sndBid + 10%(yourBid - topBid + sndBid)<br/>
            - You are second-highest bidder: (yourBid - sndBid) or (10%*yourBid)<br/>
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">04&nbsp;&nbsp;|&nbsp;&nbsp;Finalize auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            After the reveal phase finished, anyone can finalize auction. Status will be changed to "Deleted"
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default VickreyTut;