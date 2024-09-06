import { Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dutchAuctionABI from "src/api/contracts/abi/DutchAuctionBaseABI.json";
import toast from "react-hot-toast";

const DutchCancelAction = ({ callback, data, account }) => {
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
              ["auction", [2]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 2],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });

  const cancelDutchAuction = () => {
    writeContract({
      abi: dutchAuctionABI,
      address: data.auctionAddress,
      functionName: 'cancelAuction',
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
      onClick={() => cancelDutchAuction()} fullWidth disabled={isLoading} size="small"
    >
      {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Cancel auction" }
    </Button>
  )
}

export default DutchCancelAction;