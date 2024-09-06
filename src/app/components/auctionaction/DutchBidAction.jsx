import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dutchAuctionABI from "src/api/contracts/abi/DutchAuctionBaseABI.json";
import NumberInput from "src/app/components/input/NumberInput";
import { getTokenName } from "src/api/contracts";
import { formatEther } from "viem";
import toast from "react-hot-toast";
import { useApproveToken } from "src/hooks/useApproveToken";

const DutchBidAction = ({ callback, data, price, account }) => {
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
              ["biddedAuction", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });

  const callBidFunction = useCallback(() => {
    writeContract({
      abi: dutchAuctionABI,
      address: data.auctionAddress,
      functionName: 'buy',
      args: [price.toString()]
    });
  }, [data.auctionAddress, writeContract, price]);
  const { callWithApprove, isLoadingApprove } = useApproveToken({
    callback: callBidFunction,
    paymentToken: data.paymentToken,
    approvedAddress: data.auctionAddress,
    amount: price,
  });

  const bidDutchAuction = async () => {
    if(data.paymentToken == "0x0000000000000000000000000000000000000000") {
      writeContract({
        abi: dutchAuctionABI,
        address: data.auctionAddress,
        functionName: 'buy',
        args: ["0"],
        value: price.toString(), 
      });
    } else {
      callWithApprove();
    }
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending || isLoadingApprove;
  return (
    <Box display={"flex"} gap="20px" alignItems={"center"}>
      <Box display={"flex"} gap="10px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"} whiteSpace={"nowrap"}>BID AMOUNT: </Typography>
        <Box display={"flex"} gap="5px" alignItems={"center"}>
          <NumberInput value={parseFloat(formatEther(price))} setValue={() => {}} disabled/>
          <Typography>{getTokenName(data.paymentToken).symbol}</Typography>
        </Box>
      </Box>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => bidDutchAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Bid" }
      </Button>
    </Box>
  )
}

export default DutchBidAction;