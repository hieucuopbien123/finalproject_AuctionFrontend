import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VickreyRevealBatchDialog from "./VickreyRevealBatchDialog";
import { useState } from "react";
import CustomTooltip from "../tooltip";

const VickreyRevealBatch = ({data, callback}) => {
  const { pushTx } = useAppContext();
  const account = useAccount();
  const [dialogIsOpen, openDialog] = useState(false);
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
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 1],
              ["user", account.address],
              ["biddedAuction", account.address],
              ["auctionProof", data.auctionAddress]
            ]
          }
        });
        callback();
        openDialog(false);
      }
    }
  });

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;

  return (
    <Box>
      <Box display={"flex"} gap="15px" alignItems={"center"}>
        <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
          onClick={() => openDialog(true)} disabled={isLoading} fullWidth size="small"
        >
          {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Reveal batch" }
        </Button>
        <CustomTooltip text={"Reveal many proof at once, not useful yet!"}>
          <ErrorOutlineIcon/>
        </CustomTooltip>
      </Box>
      <VickreyRevealBatchDialog data={data} dialogIsOpen={dialogIsOpen} openDialog={openDialog} writeContract={writeContract} isLoading={isLoading}/>
    </Box>
  )
}

export default VickreyRevealBatch;