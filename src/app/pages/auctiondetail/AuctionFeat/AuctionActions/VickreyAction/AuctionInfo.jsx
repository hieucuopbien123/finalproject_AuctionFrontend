import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getTokenName } from "src/api/contracts";
import CustomTooltip from "src/app/components/tooltip";
import { convertSecondsToTime, formatAddress } from "src/utils";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

const AuctionInfo = ({data}) => {
  const theme = useTheme();
  const account = useAccount();
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection={"column"} gap="15px">
      {/* <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>CONTRACT ADDRESS</Typography>
        <CustomTooltip text={data.auctionAddress}>
          <Typography>{formatAddress(data.auctionAddress, 4)}</Typography>
        </CustomTooltip>
      </Box> */}
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>AUCTION CREATOR</Typography>
        <CustomTooltip text={data.auctionCreator}>
          <Typography sx={{cursor: "pointer"}} onClick={() => {
            if(data.auctionCreator && data.auctionCreator != "0x0000000000000000000000000000000000000000")
            navigate(`/userdetail/${data.auctionCreator}`);
          }}>{account?.address?.toLowerCase() == data.auctionCreator.toLowerCase() ? "You" : formatAddress(data.auctionCreator, 4)}</Typography>
        </CustomTooltip>
      </Box>
      {/* <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>BID TIMES</Typography>
        <Typography>{data.bidCount}</Typography>
      </Box> */}
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>ENDED BID TIME</Typography>
        <Typography>{(new Date(data.endTime*1000)).toLocaleString()}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>REVEAL DURATION</Typography>
        <Typography>{convertSecondsToTime(data.revealDuration)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>START REVEAL TIME</Typography>
        <Typography>{(data.startTime == 0 ? "NOT YET" : new Date(data.startTime*1000)).toLocaleString()}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>SECOND BID</Typography>
        <Typography>{formatEther(data.sndBid)} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>STARTING PRICE</Typography>
        <Typography>{formatEther(data.startingPrice)} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>HIGHEST BID</Typography>
        <Typography>{formatEther(data.topBid)} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>HIGHEST BIDDER</Typography>
        <CustomTooltip text={data.topBidder}>
          <Typography sx={{cursor: "pointer"}} onClick={() => {
          if(data.topBidder && data.topBidder != "0x0000000000000000000000000000000000000000")
            navigate(`/userdetail/${data.topBidder}`);
          }}>{account?.address?.toLowerCase() == data.topBidder.toLowerCase() ? "You" : formatAddress(data.topBidder)}</Typography>
        </CustomTooltip>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>HEART</Typography>
        <Typography>{data?.heartNum ?? 0}</Typography>
      </Box>
    </Box>
  )
}

export default AuctionInfo;