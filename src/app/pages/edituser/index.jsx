import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import EditPersonalInfo from "./EditPersonalInfo";
import { useAccount } from "wagmi";
import { useAppContext } from "src/context/useAppContext";

const EditUser = () => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <Box display="flex" height="100%">
      <Box minWidth="330px" p={3} pt={5}>
        <Box display="flex" gap="15px" bgcolor={currentPage == 1 ? theme.palette.customBg : ""} p={1} sx={{
          cursor: "pointer"
        }} onClick={() => setCurrentPage(1)}>
          <AccountBoxIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
          <Typography sx={{fontFamily: "Poppins"}} className="bigTextSize">Profile</Typography>
        </Box>
        <Box pt={0.5}/>
        <Box display="flex" gap="15px" bgcolor={currentPage == 2 ? theme.palette.customBg : ""} p={1} sx={{
          cursor: "pointer"
        }} onClick={() => setCurrentPage(2)}>
          <SettingsIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
          <Typography sx={{fontFamily: "Poppins"}} className="bigTextSize">Settings</Typography>
        </Box>
      </Box>
      <Box height="100%" p={5} pb={7} px={7} borderLeft="1px solid" borderColor={theme.palette.customBorder} flexGrow={1} sx={{
        minHeight: "calc(100vh - 82px - 41px)"
      }}>
        <Box maxWidth="675px">
          {
            currentPage == 1 && (
              account.address ?
              <EditPersonalInfo/> : 
              <>
                <Typography sx={{
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  textAlign: "center",
                  p: 1
                }}>Please connect your wallet first</Typography>
              </>
            )
          }
        </Box>
        {
          currentPage == 2 && (
            <Box>
              <Typography fontFamily={"Poppins"} fontWeight="bold" className="fontSuperSize">Settings</Typography>
              <Box py={1}/>
            </Box>
          )
        }
      </Box>
    </Box>
  )
}

export default EditUser;