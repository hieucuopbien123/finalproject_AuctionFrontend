import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import NumberInput from "src/app/components/input/NumberInput";
import { getTokenName } from "src/api/contracts";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { getBidAddress } from "src/api/contracts/interaction/VickreyAuctionBase";
import { keccak256, toUtf8Bytes } from "ethers";

const VickreyBidAction = ({ callback, callbackLater, data }) => {
  const { pushTx } = useAppContext();
  const account = useAccount();
  const [amount, setAmount] = useState(formatEther(data.startingPrice));
  const id = useRef(uuidv4());
  const { data: hash, sendTransaction, isPending } = useSendTransaction({
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
              ["user", account.address],
              ["biddedAuction", account.address]
            ],
            delay: 2000
          }
        });
        if(callback) callback();
        if(callbackLater) setTimeout(() => callbackLater(), [5000]);
      }
    }
  }); 
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(false);
  }, [amount]);
  async function getNewFileHandle() {
    const options = {
      suggestedName: `${data.auctionAddress}_${account.address}_${amount}`,
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
    await writable.write(`${data.auctionAddress}_${account.address}_${parseEther(amount.toString()).toString()}_${id.current}`);
    await writable.close();
    return true;
  }
  const bidVickreyAuction = async () => {
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
    const subSalt = keccak256(toUtf8Bytes(id.current));
    const bidInfo = await getBidAddress({
      auctionAddress: data.auctionAddress, 
      bidder: account.address, 
      bid: parseEther(amount.toString()).toString(), 
      subSalt
    });
    sendTransaction({
      to: bidInfo.address,
      value: parseEther(amount.toString()),
    });
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  return (
    <Box display={"flex"} gap="20px" alignItems={"center"}>
      <Box display={"flex"} gap="10px" alignItems={"center"}>
        <Typography fontFamily={"Poppins"} whiteSpace={"nowrap"}>BID AMOUNT: </Typography>
        <Box display={"flex"} gap="5px" alignItems={"center"}>
          <NumberInput value={amount} setValue={setAmount}/>
          <Typography>{getTokenName("0x0000000000000000000000000000000000000000").symbol}</Typography>
        </Box>
      </Box>
      <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
        onClick={() => bidVickreyAuction()} disabled={isLoading} fullWidth size="small"
      >
        {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Bid" }
      </Button>
    </Box>
  )
}

export default VickreyBidAction;