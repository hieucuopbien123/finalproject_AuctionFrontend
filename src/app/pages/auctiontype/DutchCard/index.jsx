import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts/index";
import { formatAddress, formatPrice } from "src/utils";
import { formatEther } from "viem";
import DutchCardHeader from "./DutchCardHeader";
import DutchCardPopup from "./DutchCardPopup";
import DutchCardCancelDialog from "./DutchCardPopup/DutchCardCancelDialog";
import DutchCardBidDialog from "./DutchCardPopup/DutchCardBidDialog";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import useDutchTimer from "src/hooks/auction/useDutchTimer";
import CustomTooltip from "src/app/components/tooltip";

const DutchCard = ({data, gridMode, account}) => {
  const theme = useTheme();
  const [cancelDialogIsOpen, openCancelDialog] = useState(false);
  const [bidDialogIsOpen, openBidDialog] = useState(false);
  const { auctionType } = useParams();
  const [_, copy] = useCopyToClipboard();
  const navigate = useNavigate();

  const { hours, minutes, seconds, ended, currentStep, currentPrice } = useDutchTimer({data});

  return (
    <>
      <Paper sx={{cursor: "pointer", borderRadius: "15px", overflow: "hidden", position: "relative"}} elevation={3}>
        <DutchCardHeader {...{data, hours, minutes, seconds, ended}}/>
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
            data.status == 1 && 
            <CustomTooltip text={data.auctionCreator}>
              <Typography className="fontSmallSize limitText" sx={{
                color: theme.palette.primary.main,
                fontFamily: "Poppins",
                cursor: "pointer"
              }} onClick={() => {
                if(data?.auctionCreator && data?.auctionCreator != "0x0000000000000000000000000000000000000000")
                navigate(`/userdetail/${data.auctionCreator}`)
              }}>
                Creator: {account?.address?.toLowerCase() == data.auctionCreator.toLowerCase() ? "You" : formatAddress(data.auctionCreator)}
              </Typography>
            </CustomTooltip>
          }
          <Typography className="titleSize" fontFamily={"Poppins"} fontWeight={"bold"}>
            {formatPrice(parseFloat(formatEther(currentPrice)))} {getTokenName(data.paymentToken).symbol}
          </Typography>
          {
            data.status == 0 && 
            <Typography sx={{
              color: theme.palette.primary.main,
              fontSize: "14px"
            }}>Step:&nbsp;{currentStep}/{data.numberOfStep}</Typography>
          }
          <Box pt={1}></Box>
          <Divider/>
          <Box minHeight={"37px"}>
          <Box display={"flex"} justifyContent={(!auctionType || parseInt(auctionType) > 100) ? "space-between" : "end"} py={gridMode == 0 ? 0.5 : 0} pr={0.5}>
              {
                (!auctionType || parseInt(auctionType) > 100) &&
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", opacity: "0.5"}}>
                  <Typography className="fontSmallSize" sx={{fontFamily: "Poppins", fontWeight: "lighter"}}>Dutch</Typography>
                </Box>
              }
              <DutchCardPopup {...{openCancelDialog, openBidDialog, data}}/>
            </Box>
          </Box>
        </Box>
      </Paper>
      <DutchCardCancelDialog {...{cancelDialogIsOpen, openCancelDialog, data, account}}/>
      <DutchCardBidDialog {...{bidDialogIsOpen, openBidDialog, data, account, price: currentPrice}}/>
    </>
  )
}

export default DutchCard;
