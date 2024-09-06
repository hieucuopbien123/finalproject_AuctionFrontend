import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useNavigate } from "react-router-dom";
import CollectionList from "./CollectionList";
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

const HomePage = () => {
  const { colorMode: { currentMode } } = useAppContext();
  const navigate = useNavigate();

  return (
    <Box position="relative" className="animate__animated animate__fadeIn" pb={"42px"}>
      <Box 
        className="homebackground" 
        sx={{
          opacity: 0.1,
          position: "absolute",
          width: "100%",
          top: 0,
          maskImage: "linear-gradient(0deg, transparent, rgba(0, 0, 0, .75))",
          backgroundImage: "url(https://x2y2.io/pattern.svg)",
          height: "200px",
          backgroundSize: "48px 48px"
        }}
      >
      </Box>
      <Box 
        className="homebackground" 
        sx={{
          opacity: 1,
          position: "absolute",
          width: "100%",
          top: 0,
          maskImage: "linear-gradient(0deg, transparent, rgba(0, 0, 0, .75))",
          backgroundImage: currentMode == "dark" ? "" : "linear-gradient(#ffffff, transparent)",
          height: "100px",
        }}
      >
      </Box>
      <Container maxWidth="xl">
        <Box py={2}/>
        <Box zIndex={10} position="relative">
          <Typography className="fontSuperSize" fontFamily={"Poppins"} fontWeight="bolder">
            Buy, sell, and lend your NFTs
          </Typography>
          <Typography style={{opacity: 0.7}}>
            Best place to liquify your illiquidity
          </Typography>
        </Box>
        <Box py={2.5}/>
        <Box px={0}>
          <CollectionList/>
        </Box>
        <Box py={2}/>
        <Box>
          <Box sx={{
            backgroundImage: "url(/preview.webp)",
            borderRadius: "20px",
            p: 3,
            px: 4,
            cursor: "pointer",
            backgroundSize: "cover",
            backgroundPosition: "0 100%"
          }} onClick={() => navigate("/auctionlist")}>
            <Typography sx={{color: "white", fontWeight: "bold", fontSize: "32px"}}>Check out many types of auction</Typography>
            <Typography sx={{color: "white"}}>Auction your NFTs now</Typography>
          </Box>
        </Box>
        <Box py={2}/>
        <Box>
          <Typography className="fontSuperSize" fontFamily={"Poppins"} fontWeight="bolder">
            Auctions List
          </Typography>
          <Box py={1}/>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
            gap: "13px"
          }}>
            {
              auctionsList.map(a => (
                <AuctionCard key={a.type} a={a}/>
              ))
            }
          </div>
        </Box>
        <Box py={3}/>
      </Container>
    </Box>
  )
}

export default HomePage;