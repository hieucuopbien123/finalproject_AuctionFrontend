import { Box, Typography } from "@mui/material";
import React from "react";
import OneImage from "src/app/components/multiimageview/OneImage";
import { formatAddress, getImage } from "src/utils";
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import CustomTooltip from "src/app/components/tooltip";

const TrendingCard = ({data}) => {
  const navigate = useNavigate();
  return (
    <Box onClick={() => navigate(`/collectiondetail/${data.token_address}`)} sx={{cursor: "pointer"}}>
      <Box position="absolute" zIndex={11} display="flex" flexDirection="column" height="100%" justifyContent="flex-end" 
        sx={{
          p: 2,
          backgroundImage: "linear-gradient(to top, rgba(0,0,0,.48), transparent)",
          width: "324px", borderRadius: "15px", height: "324px"
        }}
      >
        <Box display="flex" gap="5px" alignItems="center">
          <CustomTooltip title={data.token_address}>
            <Typography className="bigTextSize" sx={{
              color: "white",
              fontWeight: "bold"
            }}>{data.name ? `${data.name} ${data.symbol ? `(${data.symbol})` : ""}` : formatAddress(data.token_address, 6)}</Typography>
            {
              data.verified_collection &&
              <VerifiedIcon sx={{color: "#4589FF"}}/>
            }
          </CustomTooltip>
        </Box>
        <Typography sx={{
          color: "white"
        }}>{data.auctionCount} Auctions</Typography>
        <Typography sx={{
          color: "white"
        }}>Volumn: {formatEther(data.auctionVol.toString())} USD</Typography>
      </Box>
      <OneImage src={getImage(data?.collection_logo ?? data?.collection_banner_image ?? "/default.png")} width="324px" borderRadius={"15px"}/>
    </Box>
  )
}

export default TrendingCard;