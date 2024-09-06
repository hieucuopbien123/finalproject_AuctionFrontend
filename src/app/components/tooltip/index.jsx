import { Zoom } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000000cc"
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000000cc"
  }
}));

const TooltipContent = ({text}) => {
  return (
    <div style={{fontFamily: "Poppins", opacity: "0.94"}} className="fontSmallSize">
      {text}
    </div>
  )
}

const CustomTooltip = ({ text, children }) => {
  if(!text) {
    return (
      <>
        {children}
      </>
    )
  }
  return (
    <BootstrapTooltip title={<TooltipContent text={text}/>} enterDelay={500} enterNextDelay={500} arrow TransitionComponent={Zoom} placement="top">
      {children}
    </BootstrapTooltip>
  )
}

export default CustomTooltip;