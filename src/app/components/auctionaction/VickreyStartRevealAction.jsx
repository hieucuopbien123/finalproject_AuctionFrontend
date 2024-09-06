import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import vickreyAuctionBaseABI from "src/api/contracts/abi/VickreyAuctionBaseABI.json";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CustomTooltip from "../tooltip";

const VickreyStartRevealAction = ({data, callback}) => {
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
              ["auction", [1]],
              ["auctionDetail", data.auctionAddress]
            ]
          }
        });
        callback();
      }
    }
  });

  const startReveal = async () => {
    writeContract({
      abi: vickreyAuctionBaseABI,
      address: data.auctionAddress,
      functionName: 'startReveal'
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;

  return (
    <Box display={"flex"} gap="15px" alignItems={"center"}>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => startReveal()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Start reveal" }
      </Button>
      <CustomTooltip text={"Force auction to start reveal phase if no one has revealed yet!"}>
        <ErrorOutlineIcon/>
      </CustomTooltip>
    </Box>
  )
}

export default VickreyStartRevealAction;