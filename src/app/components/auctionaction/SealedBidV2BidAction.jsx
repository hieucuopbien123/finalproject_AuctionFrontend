import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import NumberInput from "src/app/components/input/NumberInput";
import sealBidAuctionV2ABI from "src/api/contracts/abi/SealedBidAuctionV2BaseABI.json";
import { getTokenName } from "src/api/contracts";
import { encodePacked, formatEther, keccak256, parseEther } from "viem";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const SealedBidV2BidAction = ({ callback, data }) => {
  const { pushTx } = useAppContext();
  const account = useAccount();
  const [amount, setAmount] = useState(formatEther(data.startingPrice));
  const id = useRef(uuidv4());
  
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
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 4],
              ["user", account.address],
              ["biddedAuction", account.address],
            ]
          }
        });
        callback();
      }
    }
  }); 
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(false);
  }, [amount]);
  async function getNewFileHandle() {
    const options = {
      suggestedName: `${data.auctionAddress}_${amount}`,
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt'],
          },
        },
      ],
    };
    const handle = await window.showSaveFilePicker(options);
    return handle;
  }
  const saveFile = async () => {
    const fileHandler = await getNewFileHandle();
    const writable = await fileHandler.createWritable();
    await writable.write(`${data.auctionAddress}_${account.address}_${parseEther(amount.toString())}_${id.current}`);
    await writable.close();
    return true;
  }
  const bidSealedBidV2Auction = async () => {
    const amountToBid = parseEther(amount.toString());
    if(amountToBid < data.startingPrice) {
      toast.error("Bid amount must not be lower than starting price");
      return;
    }
    if(saved == false) {
      if(await saveFile()) {
        setSaved(true);
        toast.success("Save success");
      }
    }
    writeContract({
      abi: sealBidAuctionV2ABI,
      address: data.auctionAddress,
      functionName: 'makeOrEditBid',
      args: [
        keccak256(encodePacked(["uint256", "bytes32"], [parseEther(amount.toString()), keccak256(id.current)]))
      ],
    });  
  };

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Box display={"flex"} gap="20px" alignItems={"center"}>
      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"} whiteSpace={"nowrap"}>BID AMOUNT: </Typography>
        <Box display={"flex"} gap="5px" alignItems={"center"}>
          <NumberInput value={amount} setValue={setAmount}/>
          <Typography>{getTokenName(data.paymentToken).symbol}</Typography>
        </Box>
      </Box>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => bidSealedBidV2Auction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Bid or edit to this price" }
      </Button>
    </Box>
  )
}

export default SealedBidV2BidAction;