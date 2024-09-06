import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const DutchTut = () => {
  const theme = useTheme();
  return (
    <Box display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{backgroundColor: theme.palette.customBg, p: 3, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">01&nbsp;&nbsp;|&nbsp;&nbsp;Create Dutch auction</Typography>
        <Box pt={1}/>
        <Box>
          <img style={{objectFit: "contain", maxWidth: "500px"}}
            src={"/dutch.jpeg"}
          />
          <Box pt={1}/>
          <Box display={"flex"} flexDirection={"column"} gap="10px">
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"Starting bid" is the highest bid that will start to be decreased.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"Minimum price" is the final lowest price.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"ONE STEP DURATION" is the time interval of one step. The total time: ONE STEP DURATION * numberOfSteps</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"START AFTER" is delay time auction in the sealed status.</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">02&nbsp;&nbsp;|&nbsp;&nbsp;Bid auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>The price will be reduced linearly when one step is ended.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>From the final step onwards, the price of auction will always be fixed at the minimum price. It works like a normal buy-sell market</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Users must approve (if ERC20) before bidding.</Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">03&nbsp;&nbsp;|&nbsp;&nbsp;Cancel proof</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Only auction owner can cancel auction if noone has bidded yet.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            After canceled, auction status will be changed to "Deleted"
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default DutchTut;