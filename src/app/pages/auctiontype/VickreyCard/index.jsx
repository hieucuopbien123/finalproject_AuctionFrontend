import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts/index";
import { convertSecondsToTime, formatAddress, formatPrice } from "src/utils";
import { formatEther } from "viem";
import VickreyCardHeader from "./VickreyCardHeader";
import VickreyCardPopup from "./VickreyCardPopup";
import VickreyCardBidDialog from "./VickreyCardPopup/VickreyCardBidDialog";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import VickreyCardRevealDialog from "./VickreyCardPopup/VickreyCardRevealDialog";
import VickreyCardClaimDialog from "./VickreyCardPopup/VickreyCardClaimDialog";
import useVickreyTimer from "src/hooks/auction/useVickreyTimer";
import CustomTooltip from "src/app/components/tooltip";
import { useAccount } from "wagmi";

const VickreyCard = ({data, gridMode}) => {
  const theme = useTheme();
  const [bidDialogIsOpen, openBidDialog] = useState(false);
  const [revealDialogIsOpen, openRevealDialog] = useState(false);
  const [claimDialogIsOpen, openClaimDialog] = useState(false);
  const { auctionType } = useParams();
  const account = useAccount();
  const navigate = useNavigate();
  const [_, copy] = useCopyToClipboard();
  
  const { hours, minutes, seconds } = useVickreyTimer({ data });

  return (
    <>
      <Paper sx={{cursor: "pointer", borderRadius: "15px", overflow: "hidden", position: "relative"}} elevation={3}>
        <VickreyCardHeader {...{data, hours, minutes, seconds}}/>
        <Box px={2 - gridMode} pt={0.5}>
          <Box pt={0.5}></Box>
          <CustomTooltip text={data.auctionAddress}>
            <Typography className="fontSmallSize limitText" sx={{
              color: theme.palette.primary.main,
              fontFamily: "Poppins"
            }} onClick={() => {
              copy(data.auctionAddress);
              toast.success("Copied");
            }}>{formatAddress(data.auctionAddress, 6)}</Typography>
          </CustomTooltip>
          {
            data.startTime == "0" ? (
              <>
                <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>{formatPrice(parseFloat(formatEther(data.startingPrice)))} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
                <Typography sx={{
                  color: theme.palette.primary.main,
                  fontSize: "14px"
                }}>
                  Bid count: {data.bidCount}
                </Typography>
                <Typography sx={{
                  color: theme.palette.primary.main,
                  fontSize: "14px"
                }}>Reveal duration&nbsp; {convertSecondsToTime(data.revealDuration)}</Typography>
              </>
            ) : (
              <>
                <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>{formatPrice(parseFloat(formatEther(data.topBid)))} {getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
                <CustomTooltip text={data.topBidder}>
                  <Typography sx={{
                    color: theme.palette.primary.main,
                    fontSize: "14px",
                    cursor: "pointer"
                  }} onClick={() => {
                    if(data.topBidder && data.topBidder != "0x0000000000000000000000000000000000000000")
                    navigate(`/userdetail/${data.topBidder}`)
                  }}>Highest bidder&nbsp; {account?.address?.toLowerCase() == data.topBidder.toLowerCase() ? "You" : formatAddress(data.topBidder, 2)}</Typography>
                </CustomTooltip>
              </>
            )
          }
          <Box pt={1}></Box>
          <Divider/>
          <Box minHeight={"37px"}>
            <Box display={"flex"} justifyContent={(!auctionType || parseInt(auctionType) > 100) ? "space-between" : "end"} py={gridMode == 0 ? 0.5 : 0} pr={0.5}>
              {
                (!auctionType || parseInt(auctionType) > 100) &&
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", opacity: "0.5"}}>
                  <Typography className="fontSmallSize" sx={{fontFamily: "Poppins", fontWeight: "lighter"}}>Vickrey</Typography>
                </Box>
              }
              <VickreyCardPopup {...{openBidDialog, openRevealDialog, openClaimDialog, data}}/>
            </Box>
          </Box>
        </Box>
      </Paper>
      <VickreyCardBidDialog {...{bidDialogIsOpen, openBidDialog, data}}/>
      <VickreyCardRevealDialog {...{revealDialogIsOpen, openRevealDialog, data}}/>
      <VickreyCardClaimDialog {...{claimDialogIsOpen, openClaimDialog, data}}/>
    </>
  )
}

export default VickreyCard;