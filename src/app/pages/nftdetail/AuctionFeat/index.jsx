import React from "react";
import AuctionActions from "./AuctionActions/index";
import AuctionImages from "./AuctionImages";
import { Box } from "@mui/material";

const AuctionFeat = ({data}) => {
  return (
    <Box className="auctionDetailLayout" sx={{
        gridTemplateRows: "min-content 1fr",
        width: "100%",
        display: "grid"
      }}
    >
      <AuctionActions data={data}/>
      <AuctionImages data={data}/>      
    </Box>
  )
}

export default AuctionFeat;