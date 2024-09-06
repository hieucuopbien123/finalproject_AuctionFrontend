import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { getTokenName } from "src/api/contracts";
import NumberInput from "src/app/components/input/NumberInput";
import { encodeAbiParameters, parseEther } from "viem";
import useTransferNFT from "src/hooks/useTransferNFT";
import CreateActionButton from "src/app/components/button/CreateActionButton";
import { AuctionType } from "src/utils";

const VickreyAuctionCreation = ({ data, writeContract, isLoading, callback, nftAmount }) => {
  const [startingBid, setStartingBid] = useState(1);
  const [hourBid, setHourBid] = useState(1);
  const [minuteBid, setMinuteBid] = useState(0);
  const [hourReveal, setHourReveal] = useState(1);
  const [minuteReveal, setMinuteReveal] = useState(0);
  const { transferNFT } = useTransferNFT({ writeContract, data, nftAmount });

  const createNewVickreyAuction = async () => {
    const vickreyParams = encodeAbiParameters(
      [
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
      ],
      [
        (parseEther(startingBid.toString())).toString(), 
        Math.floor(hourBid*60*60)+Math.floor(minuteBid*60), 
        Math.floor(hourReveal*60*60)+Math.floor(minuteReveal*60), 
      ]
    );
    await transferNFT(vickreyParams, AuctionType.Vickrey);
    callback();
  }

  return (
    <Box py={2} px={4} display={"flex"} flexDirection={"column"} gap="10px" height="100%" justifyContent={"space-evenly"} minHeight="320px">
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>STARTING BID: </Typography>
        <Box display={"flex"} gap="5px" alignItems={"center"}>
          <NumberInput width={"100px"} value={startingBid} setValue={setStartingBid}/>
          <Typography>{getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
        </Box>
      </Box>
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>BID DURATION: </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <NumberInput value={hourBid} setValue={setHourBid}/>
          <Typography>hours</Typography>
          <NumberInput value={minuteBid} setValue={setMinuteBid}/>
          <Typography>minutes</Typography>
        </Box>
      </Box>
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>REVEAL DURATION: </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <NumberInput value={hourReveal} setValue={setHourReveal}/>
          <Typography>hours</Typography>
          <NumberInput value={minuteReveal} setValue={setMinuteReveal}/>
          <Typography>minutes</Typography>
        </Box>
      </Box>
      <CreateActionButton onClick={createNewVickreyAuction} isLoading={isLoading}/>
    </Box>
  )
}

export default VickreyAuctionCreation;