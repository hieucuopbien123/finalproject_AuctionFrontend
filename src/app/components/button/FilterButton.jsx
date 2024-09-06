import { IconButton, useTheme } from "@mui/material";
import { LuFilter } from "react-icons/lu";
import React from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAppContext } from "src/context/useAppContext";

const FilterButton = ({filterOpen, setFilterOpen}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  return (
    <IconButton sx={{borderRadius: "8px", p: "6px", border: "2px solid #d0d1d4",
      transition: "0s",
      "&:hover": {
        backgroundColor: currentMode == "dark" ? "white" : "black",
        "svg": {
          color: currentMode == "dark" ? `${theme.palette.customDark} !important` : `${theme.palette.customLight} !important`,
        },
      },
    }} onClick={() => setFilterOpen(!filterOpen)}>
      {
        filterOpen 
        ? <ChevronLeftIcon className="titleSize" 
            color={currentMode == "dark" ? theme.palette.customLight : theme.palette.customDark}
          />
        : <LuFilter className="titleSize" 
          color={currentMode == "dark" ? theme.palette.customLight : theme.palette.customDark}
        />
      }
    </IconButton>
  )
}

export default FilterButton;
