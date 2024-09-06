import { Box, Button, FormControl, InputAdornment, MenuItem, Select, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useState } from "react";
import { encodeAbiParameters, parseEther } from "viem";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NumberInput from "src/app/components/input/NumberInput";
import { getSupportedTokens } from "src/api/contracts";
import { AuctionType, convertSecondsToTime } from "src/utils";
import toast from "react-hot-toast";
import CreateActionButton from "src/app/components/button/CreateActionButton";
import useTransferNFT from "src/hooks/useTransferNFT";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function StepIconFull({text}) {
  return (
    <Box sx={{borderRadius: "50%", backgroundColor: "#9e9e9e", width: "24px", height: "24px"}}>
      <Typography sx={{color: "white", textAlign: "center"}} className="fontSmallSize">{text}</Typography>
    </Box>
  );
}

const DutchAuctionCreation = ({ data, writeContract, isLoading, callback, nftAmount }) => {
  const [startingBid, setStartingBid] = useState(1);
  const [minimumBid, setMinimumBid] = useState(1);
  const [stepNum, setStepNum] = useState(3);
  const [hour, setHour] = useState(1);
  const [currency, setCurrency] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hourStart, setHourStart] = useState(0);
  const [minuteStart, setMinuteStart] = useState(0);
  const { transferNFT } = useTransferNFT({ writeContract, data, nftAmount });

  const createNewDutchAuction = async () => {
    if(startingBid < minimumBid) {
      toast.error(`Starting bid must be higher than minimum bid`);
      return;
    }
    const dutchParam = encodeAbiParameters(
      [
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'address' },
        { type: 'uint256' },
      ],
      [
        (parseEther(minimumBid.toString())).toString(), 
        (parseEther(startingBid.toString())).toString(), 
        stepNum,
        Math.floor(hour*60*60) + Math.floor(minute*60),
        getSupportedTokens[currency].address,
        Math.floor(hourStart*60*60) + Math.floor(minuteStart*60)
      ]
    );
    await transferNFT(dutchParam, AuctionType.Dutch);
    callback();
  }

  return (
    <Box pt={2} px={4} display={"flex"} flexDirection={"column"} gap="10px" height="100%" justifyContent={"space-evenly"} minHeight="320px">
      <Box display="flex" gap={"10px"}>
        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => setStepNum(stepNum + 1)}>
          Add one step
        </Button>
        <Button variant="outlined" startIcon={<RemoveCircleOutlineIcon />} onClick={() => {
          if(stepNum > 2) setStepNum(stepNum - 1)
        }}>
          Remove one step
        </Button>
      </Box>
      <Box overflow={"scroll"}>
        <Box minWidth="500px">
          {
            stepNum <= 10 ?
            <Stepper>
              <Step>
                <StepLabel StepIconComponent={() => <StepIconFull text={1}/>}></StepLabel>
              </Step>
              {
                Array(stepNum - 1).fill(1).map((s, index) => (
                  <Step>
                    <StepLabel StepIconComponent={() => <StepIconFull text={index + 2}/>}></StepLabel>
                  </Step>
                ))
              }
            </Stepper> : (
              <Stepper>
                {
                  Array(4).fill(1).map((s, index) => (
                    <Step>
                      <StepLabel StepIconComponent={() => <StepIconFull text={index + 1}/>}></StepLabel>
                    </Step>
                  ))
                }
                <Step>
                  <StepLabel StepIconComponent={() => <StepIconFull text={"..."}/>}></StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={() => <StepIconFull text={"..."}/>}></StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={() => <StepIconFull text={stepNum}/>}></StepLabel>
                </Step>
              </Stepper>
            )
          }
          <Box py={1}></Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} gap={"10px"} alignItems={"center"}>
              <NumberInput value={startingBid} setValue={setStartingBid} label="Starting bid" width="140px"/>
              <FormControl size="small">
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
            <NumberInput value={minimumBid} setValue={setMinimumBid} label="Minimum price" width="120px" 
              InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <Typography minWidth={"35px"} textAlign={"center"}>{getSupportedTokens[currency].symbol}</Typography>
                  </InputAdornment>,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"}>ONE STEP DURATION: </Typography>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <NumberInput value={hour} setValue={setHour}/>
          <Typography>hours</Typography>
          <NumberInput value={minute} setValue={setMinute}/>
          <Typography>minutes</Typography>
        </Box>
        <Typography className="fontSmallSize" sx={{opacity: "0.7"}}>Total: {convertSecondsToTime((hour*60*60 + minute*60)*(stepNum - 1))}</Typography>
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
      <CreateActionButton onClick={createNewDutchAuction} isLoading={isLoading}/>
    </Box>
  )
}

export default DutchAuctionCreation;