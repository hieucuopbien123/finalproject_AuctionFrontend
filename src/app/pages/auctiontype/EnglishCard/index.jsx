import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts/index";
import { formatAddress, formatPrice } from "src/utils";
import { formatEther } from "viem";
import EnglishCardHeader from "./EnglishCardHeader";
import EnglishCardPopup from "./EnglishCardPopup";
import EnglishCardCancelDialog from "./EnglishCardPopup/EnglishCardCancelDialog";
import EnglishCardBidDialog from "./EnglishCardPopup/EnglishCardBidDialog";
import { useNavigate, useParams } from "react-router-dom";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import toast from "react-hot-toast";
import EnglishCardEditDialog from "./EnglishCardPopup/EnglishCardEditDialog";
import EnglishCardClaimDialog from "./EnglishCardPopup/EnglishCardClaimDialog";
import useEnglishTimer from "src/hooks/auction/useEnglishTimer";
import CustomTooltip from "src/app/components/tooltip";
import { useAccount } from "wagmi";

const EnglishCard = ({data, gridMode}) => {
  const theme = useTheme();
  const [cancelDialogIsOpen, openCancelDialog] = useState(false);
  const [bidDialogIsOpen, openBidDialog] = useState(false);
  const [editDialogIsOpen, openEditDialog] = useState(false);
  const [finalizeDialogIsOpen, openFinalizeDialog] = useState(false);
  const { auctionType } = useParams();
  const account = useAccount();
  const [_, copy] = useCopyToClipboard();
  const navigate = useNavigate();

  const { hours, minutes, seconds, ended } = useEnglishTimer({data});

  return (
    <>
      <Paper sx={{cursor: "pointer", borderRadius: "15px", overflow: "hidden", position: "relative"}} elevation={3}>
        <EnglishCardHeader {...{data, hours, minutes, seconds, ended}}/>
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
          <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>
            {
              data.highestBidder == "0x0000000000000000000000000000000000000000" ?
              formatPrice(parseFloat(formatEther(data.startingPrice))) :
              formatPrice(parseFloat(formatEther(data.highestBid)))
            }&nbsp;{getTokenName(data.paymentToken).symbol}
          </Typography>
          <CustomTooltip text={data.highestBidder}>
            <Typography sx={{
              color: theme.palette.primary.main,
              fontSize: "14px",
              cursor: "pointer"
            }} onClick={() => {
              if(data.highestBidder && data.highestBidder != "0x0000000000000000000000000000000000000000")
              navigate(`/userdetail/${data.highestBidder}`)
            }}>Highest bidder&nbsp; {account?.address?.toLowerCase() == data.highestBidder.toLowerCase() ? "You" : formatAddress(data.highestBidder, 3)}</Typography>
          </CustomTooltip>
          <Box pt={1}></Box>
          <Divider/>
          <Box minHeight={"37px"}>
            <Box display={"flex"} justifyContent={(!auctionType || parseInt(auctionType) > 100) ? "space-between" : "end"} py={gridMode == 0 ? 0.5 : 0} pr={0.5}>
              {
                (!auctionType || parseInt(auctionType) > 100) &&
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", opacity: "0.5"}}>
                  <Typography className="fontSmallSize" sx={{fontFamily: "Poppins", fontWeight: "lighter"}}>English</Typography>
                </Box>
              }
              <EnglishCardPopup 
                {...{openCancelDialog, openBidDialog, openEditDialog, openFinalizeDialog, data}}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
      <EnglishCardCancelDialog {...{cancelDialogIsOpen, openCancelDialog, data}}/>
      <EnglishCardBidDialog {...{bidDialogIsOpen, openBidDialog, data}}/>
      <EnglishCardEditDialog {...{editDialogIsOpen, openEditDialog, data}}/>
      <EnglishCardClaimDialog {...{finalizeDialogIsOpen, openFinalizeDialog, data}}/>
    </>
  )
}

export default EnglishCard;