import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import vickreyAuctionBaseABI from "src/api/contracts/abi/VickreyAuctionBaseABI.json";

const VickreyClaimAction = ({ callback, data }) => {
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
              ["auction", [1]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 1],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });
  const claimWinVickreyAuction = async () => {
    writeContract({
      abi: vickreyAuctionBaseABI,
      address: data.auctionAddress,
      functionName: 'claimWin'
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Box display={"flex"} gap="20px" alignItems={"center"}>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => claimWinVickreyAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : 
          (account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() ? "Finalize" : "Claim") 
        }
      </Button>
    </Box>
  )
}

export default VickreyClaimAction;