import { Box, Typography } from "@mui/material";
import React from "react";

export function FailToLoad({ size, color, title, className }) {
  return (
    <Box style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
      <svg width={size} height={size} fill={color} viewBox="-15 0 150.24 100.23">
        <g style={{stroke: "none", strokeWidth: 0, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: {color}, opacity: 1}} transform="translate(1.4065934065934016 1.4065934065934016)" >
          <path d="M 8 90 c -2.047 0 -4.095 -0.781 -5.657 -2.343 c -3.125 -3.125 -3.125 -8.189 0 -11.314 l 74 -74 c 3.125 -3.124 8.189 -3.124 11.314 0 c 3.124 3.124 3.124 8.189 0 11.313 l -74 74 C 12.095 89.219 10.047 90 8 90 z" style={{stroke: "none", strokeWidth: 0.5, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: {color}, fillRule: "nonzero", opacity: 1}} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
          <path d="M 82 90 c -2.048 0 -4.095 -0.781 -5.657 -2.343 l -74 -74 c -3.125 -3.124 -3.125 -8.189 0 -11.313 c 3.124 -3.124 8.189 -3.124 11.313 0 l 74 74 c 3.124 3.125 3.124 8.189 0 11.314 C 86.095 89.219 84.048 90 82 90 z" style={{stroke: "none", strokeWidth: 0.5, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: {color}, opacity: 1}} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
        </g>
      </svg>
      <Typography component="p" variant="h5" style={{ color }} className={className}>
        {title}
      </Typography>
    </Box>
  );
}

FailToLoad.defaultProps = {
  size: "5.5rem",
  color: "#fc2f70",
  title: "Network error!",
  className: "fontNomSize"
};