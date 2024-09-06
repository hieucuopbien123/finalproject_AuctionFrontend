import { Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import englishAuctionABI from "src/api/contracts/abi/EnglishAuctionBaseABI.json";
import toast from "react-hot-toast";

const EnglishClaimAction = ({ callback, data }) => {
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
              ["auction", [0]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 0],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });

  const claimEnglishAuction = () => {
    writeContract({
      abi: englishAuctionABI,
      address: data.auctionAddress,
      functionName: 'finalizeAuction',
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
      onClick={() => claimEnglishAuction()} fullWidth disabled={isLoading} size="small"
    >
      {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Finalize auction" }
    </Button>
  )
}

export default EnglishClaimAction;