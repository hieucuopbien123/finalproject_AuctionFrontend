import { Box, IconButton, useTheme } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";

const GridButton = ({gridMode, setGridMode}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  return (
    <Box sx={{whiteSpace: "nowrap", borderRadius: "8px", border: "2px solid #d0d1d4", display: "inline-block"}}>
      <IconButton sx={{p: "6px", pr: 0.5}} disableRipple onClick={() => setGridMode(0)}>
        <IoGrid className="titleSize" opacity={gridMode == 0 ? 1 : 0.6} color={currentMode == "dark" ? theme.palette.customLight : theme.palette.customDark}/>
      </IconButton>
      <IconButton sx={{p: "6px"}} disableRipple onClick={() => setGridMode(1)}>
        <BsFillGrid3X3GapFill className="titleSize" opacity={gridMode == 1 ? 1 : 0.6} color={currentMode == "dark" ? theme.palette.customLight : theme.palette.customDark}/>
      </IconButton>
    </Box>
  )
}

export default GridButton;
