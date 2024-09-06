import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import CreateBulkAuctionDialog from "./CreateBulkAuctionDialog";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { useAppContext } from "src/context/useAppContext";

const ButtonCreateMultiNFTsAuction = ({ bulkChosen, account: { address }, setBulkChosen }) => {
  const { pushTx } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [auctionType, setAuctionType] = useState(0);
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
              ["auction", auctionType],
              ["auctionStats", auctionType],
              ["user", address]
              ["userNFTs", address],
            ]
          },
        });
        setDialogOpen(false);
        setBulkChosen([]);
      }
    }
  });
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <>
      <Button variant='outlined' disabled={bulkChosen.length <= 1}
        onClick={() => setDialogOpen(true)}
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"30px"}/> : "Create multi-nfts auction" }
      </Button>
      <CreateBulkAuctionDialog 
        {...{data: bulkChosen, writeContract, isLoading, setAuctionType, dialogOpen, setDialogOpen, setBulkChosen}}
      />
    </>
  )
}

export default ButtonCreateMultiNFTsAuction;