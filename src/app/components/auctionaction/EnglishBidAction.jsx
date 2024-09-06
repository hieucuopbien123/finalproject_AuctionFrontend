import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import englishAuctionABI from "src/api/contracts/abi/EnglishAuctionBaseABI.json";
import NumberInput from "src/app/components/input/NumberInput";
import { getTokenName } from "src/api/contracts";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";
import { useApproveToken } from "src/hooks/useApproveToken";

const EnglishBidAction = ({ data, callback }) => {
  const { pushTx } = useAppContext();
  const account = useAccount();
  const [amount, setAmount] = useState(
    data.highestBidder == "0x0000000000000000000000000000000000000000" ?
    formatEther(data.startingPrice) :
    formatEther(data.highestBid)
  );
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
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 0],
              ["user", account.address],
              ["biddedAuction", account.address]
            ]
          }
        });
        callback();
      }
    }
  });

  const callBidFunction = useCallback(() => {
    writeContract({
      abi: englishAuctionABI,
      address: data.auctionAddress,
      functionName: 'makeBid',
      args: [parseEther(amount.toString()).toString()]
    });
  }, [amount, data.auctionAddress, writeContract]);
  const { callWithApprove, isLoadingApprove } = useApproveToken({
    callback: callBidFunction,
    paymentToken: data.paymentToken,
    approvedAddress: data.auctionAddress,
    amount: BigInt(parseEther(amount.toString())),
  });

  const bidEnglishAuction = async () => {
    if(data.paymentToken == "0x0000000000000000000000000000000000000000"){
      writeContract({
        abi: englishAuctionABI,
        address: data.auctionAddress,
        functionName: 'makeBid',
        args: ["0"],
        value: parseEther(amount.toString()).toString(), 
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
          <NumberInput value={amount} setValue={setAmount}/>
          <Typography>{getTokenName(data.paymentToken).symbol}</Typography>
        </Box>
      </Box>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => bidEnglishAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"27px"}/> : "Bid" }
      </Button>
    </Box>
  )
}

export default EnglishBidAction;