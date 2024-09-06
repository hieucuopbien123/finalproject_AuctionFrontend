import { Button } from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SpecialButtonHeader = ({text, to, ...props}) => {
  return (
    <NavLink to={to}>
      <Button 
        className="specialButton"
        sx={{
          fontWeight: "bold", 
          fontSize: "16px", 
          px: 2, py: 1, 
          fontFamily: "Poppins",
        }} 
        {...props}
      >
        {text}
      </Button>
    </NavLink>
  )
}

export default SpecialButtonHeader;