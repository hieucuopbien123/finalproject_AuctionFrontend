import { Box, Button, CircularProgress, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import englishAuctionABI from "src/api/contracts/abi/EnglishAuctionBaseABI.json";
import NumberInput from "src/app/components/input/NumberInput";
import { getSupportedTokens } from "src/api/contracts";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";

const EnglishEditAction = ({ callback, data }) => {
  const [startingBid, setStartingBid] = useState(formatEther(data.startingPrice));
  const [currency, setCurrency] = useState(0);
  const [hourBid, setHourBid] = useState(Math.floor((data.endTime - data.startTime) / 3600));
  const [minuteBid, setMinuteBid] = useState(Math.round(((data.endTime - data.startTime) % 3600) / 60));
  const { pushTx } = useAppContext();
  const { data: hash, isPending, writeContract } = useWriteContract({
    mutation: {
      onError: (e) => {
        toast.error(e.shortMessage || e.message.slice(0, 50));
      },
      onSuccess: (x) => {
        pushTx({
          [x]: {
            hash: x,
            refetchQueries: [
              ["auction", [0]],
              ["auctionDetail", data.auctionAddress],
            ]
          }
        });
        callback();
      }
    }
  });

  const editEnglishAuction = async () => {
    writeContract({
      abi: englishAuctionABI,
      address: data.auctionAddress,
      functionName: 'editAuction',
      args: [parseEther(startingBid.toString()).toString(), Math.floor(hourBid*60*60) + Math.floor(minuteBid*60), getSupportedTokens[currency].address]
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <>
      <Box display={"flex"} gap="10px" alignItems={"center"} flexWrap={"wrap"}>
        <Typography fontFamily={"Poppins"} sx={{whiteSpace: "nowrap", width: "103px"}}>STARTING BID: </Typography>
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
      <Box pt={2}></Box>
      <Box display={"flex"} gap="10px" alignItems={"center"} flexWrap={"wrap"}>
        <Typography fontFamily={"Poppins"} whiteSpace={"nowrap"}>BID DURATION: </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"10px"} flexWrap={"wrap"}>
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <NumberInput value={hourBid} setValue={setHourBid}/>
            <Typography>hours</Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <NumberInput value={minuteBid} setValue={setMinuteBid}/>
            <Typography>minutes</Typography>
          </Box>
        </Box>
      </Box>
      <Box py={1}></Box>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => editEnglishAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"30px"}/> : "Confirm Edit" }
      </Button>
    </>
  )
}

export default EnglishEditAction;