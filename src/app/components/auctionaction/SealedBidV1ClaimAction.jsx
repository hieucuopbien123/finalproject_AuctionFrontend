import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import sealedBidAuctionV1BaseABI from "src/api/contracts/abi/SealedBidAuctionV1BaseABI.json";

const SealedBidV1ClaimAction = ({ callback, data }) => {
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
              ["auction", [3]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 3],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });
  const claimWinSealedBidV1Auction = async () => {
    writeContract({
      abi: sealedBidAuctionV1BaseABI,
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
        onClick={() => claimWinSealedBidV1Auction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : 
          (account?.address?.toLowerCase() == data.auctionCreator?.toLowerCase() ? "Finalize" : "Claim") 
        }
      </Button>
    </Box>
  )
}

export default SealedBidV1ClaimAction;