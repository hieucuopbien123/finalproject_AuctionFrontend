import { Box, Container, Skeleton, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { FailToLoad } from "src/app/components/error";
import useAuctionStats from "src/hooks/reactquery/useAuctionStats";

// 0: English auction
// 1: Vickrey auction
// 2: Dutch auction
// 3: Sealed bid auction v1
// 4: Sealed bid auction v2
// 5: Archive auction

const configs = {
  "0": {
    name: "English Auction",
    description: "An English auction is like a thrilling bidding battle where participants publicly outbid each other, driving the price higher until only the most determined bidder remains standing, claiming their prize.",
  },
  "1": {
    name: "Vickrey Auction",
    description: "Vickrey Auction, also known as a second-price sealed-bid auction, is a type of auction in which the winner pays the price offered by the second-highest bidder. This format encourages bidders to bid their true value, as they know they will only pay the second-highest price. It was first described by William Vickrey in 1961 and is widely used in various applications, including online advertising and spectrum auctions.",
  },
  "2": {
    name: "Dutch Auction",
    description: "Dutch Auction - where the price starts high and drops like a mic at a rap battle! 🎤💸",
  },
  "3": {
    name: "Sealed Bid Auction v1",
    description: "Imagine you're at a secret treasure auction, where instead of shouting out bids, everyone writes their bid on a piece of paper and seals it in an envelope. 💌 At the end, all the envelopes are opened, and just like the grand reveal in a magic show, the highest bid wins the treasure! 🎩✨ This silent, mysterious process is what we call a sealed bid auction. It's like a bidding game where everyone's poker face is an envelope! 🕵️‍♂️💰 The identity of bidders stays hidden.",
  },
  "4": {
    name: "Sealed Bid Auction v2",
    description: "Just like Sealed Bid Auction v1, but we all know who the bidders are! 👨‍👩‍👧‍👦",
  },
  "5": {
    name: "Archived auction",
    description: "Auctions which are ended or deleted",
  },
}

const AuctionHeader = () => {
  const { auctionType } = useParams();
  const { data, isError, error, isLoading } = useAuctionStats({auctionType: parseInt(auctionType)});
  if(isLoading) {
    return <Container maxWidth={"xxl"}>
      <Skeleton variant="rounded" width={"max(200px, 20%)"} height={"50px"} />
      <Box pt={1}/>
      <Skeleton variant="rounded" width={"80%"} height={"60px"} />
      <Box py={1}/>
      <Box display={"flex"} gap="50px" flexWrap={"wrap"}>
        <Box>
          <Skeleton variant="rounded" width={"70px"} height={"60px"} />
        </Box>
        <Box>
          <Skeleton variant="rounded" width={"70px"} height={"60px"} />
        </Box>
        <Box>
          <Skeleton variant="rounded" width={"70px"} height={"60px"} />
        </Box>
        <Box>
          <Skeleton variant="rounded" width={"70px"} height={"60px"} />
        </Box>
      </Box>
    </Container>
  }
  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  return (
    <Container maxWidth={"xxl"}>
      <Typography fontWeight={"bolder"} className="fontSuperSize" fontFamily={"Poppins"}>
        {configs[auctionType].name}
      </Typography>
      <Box pt={1}/>
      <Typography width={"70%"}>{configs[auctionType].description}</Typography>
      <Box py={1}/>
      <Box display={"flex"} gap="50px" flexWrap={"wrap"}>
        <Box>
          <Typography className="titleSize" fontWeight={"bold"}>{data?.data?.auctionCount ?? "-"}</Typography>
          <Typography fontSize="14px">Auctions</Typography>
        </Box>
        <Box>
          <Typography className="titleSize" fontWeight={"bold"}>{data?.data?.collectionCount ?? "-"}</Typography>
          <Typography fontSize="14px">Collections</Typography>
        </Box>
        <Box>
          <Typography className="titleSize" fontWeight={"bold"}>{data?.data?.creatorCount ?? "-"}</Typography>
          <Typography fontSize="14px">Creators</Typography>
        </Box>
        <Box>
          <Typography className="titleSize" fontWeight={"bold"}>
            {parseInt(data?.data?.auctionVols) > 0 ? data?.data?.auctionVols + "USDT" : "-"}
          </Typography>
          <Typography fontSize="14px">Volume</Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default AuctionHeader;