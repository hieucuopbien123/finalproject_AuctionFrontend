import { Box, Container, Paper } from "@mui/material";
import React from "react";
import useCurrentNavigate from "src/hooks/useCurrentNavigate";
import AuctionCard from "./AuctionCard";

const auctionsList = [
  {
    type: 0,
    name: "English auction"
  },
  {
    type: 1,
    name: "Vickrey auction"
  },
  {
    type: 2,
    name: "Dutch auction"
  },
  {
    type: 3,
    name: "Sealed bid v1 auction"
  },
  {
    type: 4,
    name: "Sealed bid v2 auction"
  },
]

const AuctionList = () => {
  const navigate = useCurrentNavigate();
  return (
    <Box className="animate__animated animate__fadeIn" pt={2} pb="50px">
      <Container maxWidth="xl">
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(350px, 1fr))`,
          gap: "10px"
        }}>
          {
            auctionsList.map(a => (
              <AuctionCard a={a}/>
            ))
          }
        </div>
        <Box py={3}/>
        <Paper elevation={3} sx={{cursor: "pointer", width: "300px", textAlign: "center"}} 
          onClick={() => navigate("/auction/1000")}
        >
          <Box pt={2} className="titleSize" fontFamily="Poppins">
            Archived auction
          </Box>
          <Box className="fontSmallSize" sx={{opacity: 0.5, whiteSpace: "nowrap", py: 1}}>Deleted or canceled auctions</Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AuctionList;