import React from "react";
import { Box, Typography } from "@mui/material";
import logoImage from "src/assets/common/logo.svg";
import { NavLink } from "react-router-dom";

const Logo = ({onClick = () => {}, to, ...props}) => {
  return (
    <NavLink to={to}>
      <Box display={"flex"} alignItems={"center"} gap="3px" onClick={onClick} sx={{cursor: "pointer"}} {...props}>
        <img src={logoImage}/>
        <Typography sx={{fontSize: "large", fontFamily: "Poppins", fontWeight: "bold", letterSpacing: "3px"}}>ARTBID</Typography>
      </Box>
    </NavLink>
  )
}

export default Logo;