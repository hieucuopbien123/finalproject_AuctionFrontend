import { Box, Container, Typography } from "@mui/material";
import React from "react";

const ArchiveHeader = () => {
  return (
    <Container maxWidth={"xxl"}>
      <Typography fontWeight={"bolder"} className="fontSuperSize" fontFamily={"Poppins"}>
        Archived auction
      </Typography>
      <Box pt={1}/>
      <Typography width={"70%"}>Deleted or canceled auctions</Typography>
      <Box py={1}/>
    </Container>
  )
}

export default ArchiveHeader;