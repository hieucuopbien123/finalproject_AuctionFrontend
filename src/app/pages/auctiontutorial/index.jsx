import { Box, Container, Typography, useTheme } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import EnglishTut from "./EnglishTut";
import VickreyTut from "./VickreyTut";
import DutchTut from "./DutchTut";
import Sealedv1Tut from "./Sealedv1Tut";
import Sealedv2Tut from "./Sealedv2Tut";

function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();

  return (
    <Box display={"flex"} sx={{minHeight: "calc(100vh - 82px)"}} pb={"42px"}>
      <Box sx={{minWidth: "300px", borderRight: "1px solid", borderColor: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec", pb: 3, pt: 5, pr: 3, display: "flex", 
        flexDirection: "column", gap: "10px", height: "100%", minHeight: "calc(100vh - 82px - 42px)", opacity: 0.9}}
      >
        <Box onClick={() => setValue(0)} sx={{backgroundColor: value == 0 ? theme.palette.customBg : "", py: 1, pl: 2, borderRadius: "8px", 
          borderLeft: "4px solid", borderColor: value == 0 ? "#5F6379" : "transparent", cursor: "pointer"}}
        >
          <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize" color={currentMode == "dark" ? "#f8f8f3" : "#5F6379"}>English auction</Typography>
        </Box>
        <Box onClick={() => setValue(1)} sx={{backgroundColor: value == 1 ? theme.palette.customBg : "", py: 1, pl: 2, borderRadius: "8px", 
          borderLeft: "4px solid", borderColor: value == 1 ? "#5F6379" : "transparent", cursor: "pointer"}}>
          <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize" color={currentMode == "dark" ? "#f8f8f3" : "#5F6379"}>Vickrey auction</Typography>
        </Box>
        <Box onClick={() => setValue(2)} sx={{backgroundColor: value == 2 ? theme.palette.customBg : "", py: 1, pl: 2, borderRadius: "8px", 
          borderLeft: "4px solid", borderColor: value == 2 ? "#5F6379" : "transparent", cursor: "pointer"}}>
          <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize" color={currentMode == "dark" ? "#f8f8f3" : "#5F6379"}>Dutch auction</Typography>
        </Box>
        <Box onClick={() => setValue(3)} sx={{backgroundColor: value == 3 ? theme.palette.customBg : "", py: 1, pl: 2, borderRadius: "8px", 
          borderLeft: "4px solid", borderColor: value == 3 ? "#5F6379" : "transparent", cursor: "pointer"}}>
          <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize" color={currentMode == "dark" ? "#f8f8f3" : "#5F6379"}>Sealed bid auction v1</Typography>
        </Box>
        <Box  onClick={() => setValue(4)}sx={{backgroundColor: value == 4 ? theme.palette.customBg: "", py: 1, pl: 2, borderRadius: "8px", 
          borderLeft: "4px solid", borderColor: value == 4 ? "#5F6379" : "transparent", cursor: "pointer"}}>
          <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize" color={currentMode == "dark" ? "#f8f8f3" : "#5F6379"}>Sealed bid auction v2</Typography>
        </Box>
      </Box>
      <Box sx={{p: 3, px: 5, flexGrow: 1}}>
        {
          value == 0 && (
            <>
              <EnglishTut/>
            </>
          ) 
        }
        {
          value == 1 && (
            <>
              <VickreyTut/>
            </>
          ) 
        }
        {
          value == 2 && (
            <>
              <DutchTut/>
            </>
          ) 
        }
        {
          value == 3 && (
            <>
              <Sealedv1Tut setValue={setValue}/>
            </>
          ) 
        }
        {
          value == 4 && (
            <>
              <Sealedv2Tut/>
            </>
          ) 
        }
      </Box>
    </Box>
  );
}

const AuctionTutorial = () => {
  return (
    <Container maxWidth="xl" className="animate__animated animate__fadeIn" style={{minHeight: "calc(100vh - 82px)"}}>
      <VerticalTabs/>
    </Container>
  )
}

export default AuctionTutorial;