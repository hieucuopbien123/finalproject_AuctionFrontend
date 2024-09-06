import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { getSupportedTokens } from "src/api/contracts";
import NumberInput from "src/app/components/input/NumberInput";
import { encodeAbiParameters, parseEther } from "viem";
import { AuctionType } from "src/utils";
import useTransferNFT from "src/hooks/useTransferNFT";
import CreateActionButton from "src/app/components/button/CreateActionButton";

const SealedBidAuctionV2Creation = ({ data, writeContract, isLoading, callback, nftAmount }) => {
  const [startingBid, setStartingBid] = useState(1);
  const [hourBid, setHourBid] = useState(1);
  const [minuteBid, setMinuteBid] = useState(0);
  const [hourReveal, setHourReveal] = useState(1);
  const [minuteReveal, setMinuteReveal] = useState(0);
  const [currency, setCurrency] = useState(0);
  const [hourStart, setHourStart] = useState(0);
  const [minuteStart, setMinuteStart] = useState(0);
  const { transferNFT } = useTransferNFT({ writeContract, data, nftAmount });

  const createNewSealedBidAuctionV2 = async () => {
    const sealedBidV2Params = encodeAbiParameters(
      [
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'address' },
        { type: 'uint256' },
      ],
      [
        (parseEther(startingBid.toString())).toString(), 
        Math.floor(hourBid*60*60)+Math.floor(minuteBid*60), 
        Math.floor(hourReveal*60*60)+Math.floor(minuteReveal*60), 
        getSupportedTokens[currency].address,
        Math.floor(hourStart*60*60) + Math.floor(minuteStart*60)
      ]
    );
    await transferNFT(sealedBidV2Params, AuctionType.Seal2);
    callback();
  }

  return (
    <Box pt={2} px={4} display={"flex"} flexDirection={"column"} gap="10px" height="100%" justifyContent={"space-evenly"} minHeight="320px">
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>STARTING BID: </Typography>
        <Box display={"flex"} gap="5px" alignItems={"center"}>
          <NumberInput width={"100px"} value={startingBid} setValue={setStartingBid}/>
          <FormControl sx={{ml: 1, width: 100}} size="small">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {
                getSupportedTokens.map((t, index) => (
                  <MenuItem key={t.address} value={index}>{t.symbol}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
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
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>START AFTER: </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <NumberInput value={hourStart} setValue={setHourStart}/>
          <Typography>hours</Typography>
          <NumberInput value={minuteStart} setValue={setMinuteStart}/>
          <Typography>minutes</Typography>
        </Box>
      </Box>
      <CreateActionButton onClick={createNewSealedBidAuctionV2} isLoading={isLoading}/>
    </Box>
  )
}

export default SealedBidAuctionV2Creation;