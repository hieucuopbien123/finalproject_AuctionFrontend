import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";

const Sealedv1Tut = ({setValue}) => {
  const theme = useTheme();
  return (
    <Box display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{backgroundColor: theme.palette.customBg, p: 3, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">01&nbsp;&nbsp;|&nbsp;&nbsp;How it works</Typography>
        <Box pt={1}/>
        <Box>
          <Box pt={1}/>
          <Box display={"flex"} flexDirection={"column"} gap="10px">
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
              Everything is just like Vickrey auction, but the winner has to pay highest price instead of second-highest price.
            </Typography>
            <Button variant="contained" onClick={() => setValue(1)} sx={{width: "200px"}} size="small">Go to Vickrey</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sealedv1Tut;