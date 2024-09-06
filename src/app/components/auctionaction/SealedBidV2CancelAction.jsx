import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import sealBidAuctionV2ABI from "src/api/contracts/abi/SealedBidAuctionV2BaseABI.json";
import toast from "react-hot-toast";

const SealedBidV2CancelAction = ({ callback, data }) => {
  const { pushTx } = useAppContext();
  const account = useAccount();
  
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
              ["auction", [4]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 4],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });
  const cancelAuction = async () => {
    writeContract({
      abi: sealBidAuctionV2ABI,
      address: data.auctionAddress,
      functionName: 'cancelAuction'
    });  
  };

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Box display={"flex"} gap="20px" alignItems={"center"}>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => cancelAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Cancel auction" }
      </Button>
    </Box>
  )
}

export default SealedBidV2CancelAction;
