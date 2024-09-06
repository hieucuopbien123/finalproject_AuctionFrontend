import React, { useState } from "react";
import AuctionActions from "./AuctionActions/index";
import AuctionImages from "./AuctionImages";
import { Box } from "@mui/material";

const AuctionFeat = ({data}) => {
  const [currentNFT, setCurrentNFT] = useState(data.nftInfo[0]);
  return (
    <Box className="auctionDetailLayout" sx={{
        gridTemplateRows: "min-content 1fr",
        width: "100%",
        display: "grid"
      }}
    >
      <AuctionActions data={data} currentNFT={currentNFT}/>      
      <AuctionImages data={data} setCurrentNFT={setCurrentNFT}/>      
    </Box>
  )
}

export default AuctionFeat;