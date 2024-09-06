import { Box, Button, Typography } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";

const FilterSelectButton = ({text, handleClick}) => {
  const theme = useTheme();
  return (
    <>
      <Button variant="outlined" 
        onClick={handleClick}
        sx={{
        pr: 0.8,
        py: 0.5,
        height: "100%",
        border: "2px solid #35394538",
        transition: "0s all",
        "&:hover": {
          border: "2px solid #35394538",
          backgroundColor: theme.palette.mode === 'dark' ? "white" : "black",
          "& p": {
            color: theme.palette.mode === 'dark' ? "black" : "white"
          },
          "& svg": {
            fill: theme.palette.mode === 'dark' ? "black" : "white"
          }
        },
        maxWidth: "300px",
      }}>
        <Box display={"flex"} gap="10px" alignItems={"center"}>
          <Typography fontWeight={"bold"} className="fontSmallSize limitText" color={theme.palette.primary.main}>{text}</Typography>
          <CloseIcon fontSize="small" color={theme.palette.primary.main} sx={{transition: "0s all"}}/>
        </Box>
      </Button>
    </>
  )
}

export default FilterSelectButton;