import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import useAuctionConfig from "src/hooks/reactquery/useAuctionConfig";

const EnglishTut = () => {
  const { data } = useAuctionConfig();
  const theme = useTheme();
  return (
    <Box display={"flex"} flexDirection={"column"} gap="20px">
      <Box sx={{backgroundColor: theme.palette.customBg, p: 3, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">01&nbsp;&nbsp;|&nbsp;&nbsp;Create English auction</Typography>
        <Box pt={1}/>
        <Box>
          <img style={{objectFit: "contain", maxWidth: "400px"}}
            src={"/english.jpeg"}
          />
          <Box pt={1}/>
          <Box display={"flex"} flexDirection={"column"} gap="10px">
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"STARTING BID" is the minimum price that users can bid.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"BID DURATION" is the minimum time to wait from the start until the auction is ended.</Typography>
            <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>"START AFTER" is delay time auction in the sealed status.</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">02&nbsp;&nbsp;|&nbsp;&nbsp;Bid auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Anyone except bidder can bid the auction. Users must approve (if ERC20) before bidding.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            The bid amount must be higher than the current highest amount {data.englishAdminParams.bidStepPercent}%.
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            If the current bidder does not win the auction, he will be repaid: biddedAmount - {data.englishAdminParams.feePercent}%biddedAmount + {data.englishAdminParams.feePercent}%highestBid
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            The remaining time for the auction will be updated to: Math.max(currentRemainingTime, {data.englishAdminParams.minimumRemainingTime}s)
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">03&nbsp;&nbsp;|&nbsp;&nbsp;Cancel auction</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Only auction owner can cancel auction if noone has bidded yet.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            After canceled, auction status will be changed to "Deleted"
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">04&nbsp;&nbsp;|&nbsp;&nbsp;Edit</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Only auction owner can edit auction if noone has bidded yet.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            If auction is ended but no one bidded, you can edit "BID DURATION" longer so that it will be changed to "Ongoing".
          </Typography>
        </Box>
      </Box>
      <Box sx={{backgroundColor: theme.palette.customBg, p: 2, borderRadius: "5px"}}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold", opacity: 0.8}} className="bigTextSize">04&nbsp;&nbsp;|&nbsp;&nbsp;Finalize</Typography>
        <Box pt={1}/>
        <Box display={"flex"} flexDirection={"column"} gap="10px">
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>Anyone can finalize auction if auction is ended and someone bidded it.</Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            Auctioneer will received: highestBid - highestBid*{data.englishAdminParams.feePercent}%.
          </Typography>
          <Typography sx={{fontFamily: "Poppins", fontWeight: "light"}}>
            After claiming, auction will be deleted and can be founded in Archived Auction.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default EnglishTut;