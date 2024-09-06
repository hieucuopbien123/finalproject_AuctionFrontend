import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts/index";
import { convertSecondsToTime, formatAddress, formatPrice } from "src/utils";
import { formatEther } from "viem";
import SealedBidV1CardHeader from "./SealedBidV1CardHeader";
import SealedBidV1CardPopup from "./SealedBidV1CardPopup";
import SealedBidV1CardBidDialog from "./SealedBidV1CardPopup/SealedBidV1CardBidDialog";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import { useNavigate, useParams } from "react-router-dom";
import SealedBidV1CardRevealDialog from "./SealedBidV1CardPopup/SealedBidV1CardRevealDialog";
import SealedBidV1CardClaimDialog from "./SealedBidV1CardPopup/SealedBidV1CardClaimDialog";
import useSealedBidV1Timer from "src/hooks/auction/useSealedBidV1Timer";
import CustomTooltip from "src/app/components/tooltip";
import { useAccount } from "wagmi";

const SealedBidV1Card = ({data, gridMode}) => {
  const theme = useTheme();
  const account = useAccount();
  const [bidDialogIsOpen, openBidDialog] = useState(false);
  const [revealDialogIsOpen, openRevealDialog] = useState(false);
  const [claimDialogIsOpen, openClaimDialog] = useState(false);
  const { auctionType } = useParams();
  const [_, copy] = useCopyToClipboard();
  const navigate = useNavigate();

  const { hours, minutes, seconds } = useSealedBidV1Timer({ data });

  return (
    <>
      <Paper sx={{cursor: "pointer", borderRadius: "15px", overflow: "hidden", position: "relative"}} elevation={3}>
        <SealedBidV1CardHeader {...{data, hours, minutes, seconds}}/>
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
                  <Typography className="fontSmallSize" sx={{fontFamily: "Poppins", fontWeight: "lighter"}}>Sealed bid v1</Typography>
                </Box>
              }
              <SealedBidV1CardPopup {...{openBidDialog, openRevealDialog, openClaimDialog, data}}/>
            </Box>
          </Box>
        </Box>
      </Paper>
      <SealedBidV1CardBidDialog {...{bidDialogIsOpen, openBidDialog, data}}/>
      <SealedBidV1CardRevealDialog {...{revealDialogIsOpen, openRevealDialog, data}}/>
      <SealedBidV1CardClaimDialog {...{claimDialogIsOpen, openClaimDialog, data}}/>
    </>
  )
}

export default SealedBidV1Card;