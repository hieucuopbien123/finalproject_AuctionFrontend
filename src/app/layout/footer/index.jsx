import { Box, Typography } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";

const Footer = () => {
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <Box position="absolute" overflow="hidden" width="100%" bottom="0" sx={{zIndex: 1000}}>
      <Box p={1} sx={{border: "1px solid #777e902b", zIndex: 1000, backgroundColor: currentMode == "dark" ? "#282a36" : "#ffffff"}} width="100vw">
        <Typography sx={{textAlign: "center", fontFamily: "Poppins", fontWeight: "lighter", opacity: "0.5"}}>ARTBID</Typography>
      </Box>
    </Box>
  )
}

export default Footer;