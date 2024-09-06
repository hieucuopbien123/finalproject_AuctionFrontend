import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts/index";
import { convertSecondsToTime, formatAddress, formatPrice } from "src/utils";
import { formatEther } from "viem";
import SealedBidV2CardHeader from "./SealedBidV2CardHeader";
import SealedBidV2CardPopup from "./SealedBidV2CardPopup";
import SealedBidV2CardBidDialog from "./SealedBidV2CardPopup/SealedBidV2CardBidDialog";
import { useNavigate, useParams } from "react-router-dom";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import toast from "react-hot-toast";
import SealedBidV2CardCancelDialog from "./SealedBidV2CardPopup/SealedBidV2CardCancelDialog";
import SealedBidV2CardRevealDialog from "./SealedBidV2CardPopup/SealedBidV2CardRevealDialog";
import SealedBidV2CardClaimDialog from "./SealedBidV2CardPopup/SealedBidV2CardClaimDialog";
import useSealedBidV2Timer from "src/hooks/auction/useSealedBidV2Timer";
import CustomTooltip from "src/app/components/tooltip";
import { useAccount } from "wagmi";

const SealedBidV2Card = ({data, gridMode}) => {
  const theme = useTheme();
  const account = useAccount();
  const [bidDialogIsOpen, openBidDialog] = useState(false);
  const [cancelDialogIsOpen, openCancelDialog] = useState(false);
  const [revealDialogIsOpen, openRevealDialog] = useState(false);
  const [claimDialogIsOpen, openClaimDialog] = useState(false);
  const { auctionType } = useParams();
  const navigate = useNavigate();
  const [_, copy] = useCopyToClipboard();
  
  const { hours, minutes, seconds, ended } = useSealedBidV2Timer({ data });

  return (
    <>
      <Paper sx={{cursor: "pointer", borderRadius: "15px", overflow: "hidden", position: "relative"}} elevation={3}>
        <SealedBidV2CardHeader {...{data, hours, minutes, seconds, ended}}/>
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
            data.endTime > Date.now()/1000 ? (
              <>
                <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>{formatPrice(parseFloat(formatEther(data.startingPrice)))} {getTokenName(data.paymentToken).symbol}</Typography>
                {
                  Date.now()/1000 >= data.startTime && 
                  <Typography sx={{
                    color: theme.palette.primary.main,
                    fontSize: "14px"
                  }}>
                    Bid count: {data.bidStep}
                  </Typography>
                }
                <Typography sx={{
                  color: theme.palette.primary.main,
                  fontSize: "14px"
                }}>Reveal duration&nbsp; {convertSecondsToTime(data.endTime - data.startTime)}</Typography>
              </>
            ) : (
              <>
                <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>{formatPrice(parseFloat(formatEther(data.topBid == 0n ? data.startingPrice : data.topBid)))} {getTokenName(data.paymentToken).symbol}</Typography>
                {
                  (data.revealStep == 0 || (
                    data.endTime + data.revealDuration > Date.now()/1000 && data.revealStep > 0
                  )) && data.status == 0 &&
                  <Typography sx={{
                    color: theme.palette.primary.main,
                    fontSize: "14px"
                  }}>
                    Bid count: {data.bidStep}
                  </Typography>
                }
                <CustomTooltip text={data.topBidder}>
                  <Typography sx={{
                    color: theme.palette.primary.main,
                    fontSize: "14px",
                    cursor: "pointer"
                  }} onClick={() => {
                    if(data.topBidder && data.topBidder != "0x0000000000000000000000000000000000000000")
                    navigate(`/userdetail/${data.topBidder}`)
                  }}>Highest bidder&nbsp; {account?.address?.toLowerCase() == data.topBidder.toLowerCase() ? "You" : formatAddress(data.topBidder, 3)}</Typography>
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
                  <Typography className="fontSmallSize" sx={{fontFamily: "Poppins", fontWeight: "lighter"}}>Sealed bid v2</Typography>
                </Box>
              }
              <SealedBidV2CardPopup {...{openBidDialog, openCancelDialog, openRevealDialog, openClaimDialog, data}}/>
            </Box>
          </Box>
        </Box>
      </Paper>
      <SealedBidV2CardBidDialog {...{bidDialogIsOpen, openBidDialog, data}}/>
      <SealedBidV2CardCancelDialog {...{cancelDialogIsOpen, openCancelDialog, data}}/>
      <SealedBidV2CardRevealDialog {...{revealDialogIsOpen, openRevealDialog, data}}/>
      <SealedBidV2CardClaimDialog {...{claimDialogIsOpen, openClaimDialog, data}}/>
    </>
  )
}

export default SealedBidV2Card;