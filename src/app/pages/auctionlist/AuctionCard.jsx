import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import useAuctionStats from "src/hooks/reactquery/useAuctionStats";
import useCurrentNavigate from "src/hooks/useCurrentNavigate";

const AuctionCard = ({a}) => {
  const navigate = useCurrentNavigate();
  const { data, isLoading, isError } = useAuctionStats({auctionType: a.type});
  return (
    <Paper onClick={() => navigate(`/auction/${a.type}`)} sx={{cursor: "pointer"}} elevation={3}>
      <Box display="flex" flexDirection={"column"} height="100%">
        <Box sx={{
          flexGrow: 1, p: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Typography sx={{fontFamily: "Poppins", textAlign: "center", fontWeight: "light"}} className="titleSize">{a.name}</Typography>
        </Box>
        <Box px={2} pb={1} display="flex" gap="10px" justifyContent="space-between">
          <Box>
            <Box className="fontSmallSize" sx={{opacity: 0.5, whiteSpace: "nowrap"}}>Auction count</Box>
            <Box>{(isLoading || isError) ? "-" : data.data.auctionCount}</Box>
          </Box>
          <Box>
            <Box className="fontSmallSize" sx={{opacity: 0.5, whiteSpace: "nowrap"}}>Auction vols</Box>
            <Box>{(isLoading || isError) ? "-" : data.data.auctionVols} USD</Box>
          </Box>
          <Box>
            <Box className="fontSmallSize" sx={{opacity: 0.5, whiteSpace: "nowrap"}}>Collection count</Box>
            <Box>{(isLoading || isError) ? "-" : data.data.collectionCount}</Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default AuctionCard;