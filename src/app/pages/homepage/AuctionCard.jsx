import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuctionStats from "src/hooks/reactquery/useAuctionStats";

const AuctionCard = ({a}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAuctionStats({auctionType: a.type});
  return (
    <Paper elevation={3} onClick={() => navigate(`/auction/${a.type}`)} sx={{cursor: "pointer"}}>
      <Box display="flex" flexDirection={"column"} height="100%">
        <Box sx={{
          flexGrow: 1, p: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Typography sx={{fontFamily: "Poppins", textAlign: "center", fontWeight: "light"}} className="titleSize">{a.name}</Typography>
        </Box>
        <Box px={2} pb={1} display="flex" gap="30px" justifyContent="space-between">
          <Box>
            <Box className="fontSmallSize" sx={{opacity: 0.5}}>Auction count</Box>
            <Box>{(isLoading || isError) ? "-" : data.data.auctionCount}</Box>
          </Box>
          <Box>
            <Box className="fontSmallSize" sx={{opacity: 0.5}}>Auction vols</Box>
            <Box>{(isLoading || isError) ? "-" : data.data.auctionVols} USD</Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default AuctionCard;