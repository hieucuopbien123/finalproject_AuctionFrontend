import { Button } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "src/context/useAppContext";

const ButtonHeader = ({text, to, ...props}) => {
  const { colorMode } = useAppContext();
  if(!!to) {
    return (
      <>
        <NavLink to={to}>
          <Button 
            sx={{fontWeight: "bold", fontSize: "16px", borderRadius: "20px", px: 2, py: 1, fontFamily: "Poppins",
              "&:hover": {
                backgroundColor: colorMode.currentMode == "dark" ? "#353945" : "#EBEBF1"
              },
            }} 
            {...props}
          >
            {text}
          </Button>
        </NavLink>
      </>
    )
  }
  return (
    <>
      <Button 
        sx={{fontWeight: "bold", fontSize: "16px", borderRadius: "20px", px: 2, py: 1, fontFamily: "Poppins",
          "&:hover": {
            backgroundColor: colorMode.currentMode == "dark" ? "#353945" : "#EBEBF1"
          },
        }} 
        {...props}
      >
        {text}
      </Button>
    </>
  )
}

export default ButtonHeader;