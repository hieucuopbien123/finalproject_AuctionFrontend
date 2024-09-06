import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { getBidAddress, getBiddedAmount, getProof } from "src/api/contracts/interaction/VickreyAuctionBase";
import { keccak256 } from "viem";
import vickreyAuctionBaseABI from "src/api/contracts/abi/VickreyAuctionBaseABI.json";
import { toUtf8Bytes } from "ethers";

const VickreyRevealAction = ({ callback, data }) => {
  const [proof, setProof] = useState("");
  const { pushTx } = useAppContext();
  const chainId = useChainId();
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
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 1],
              ["user", account.address],
              ["biddedAuction", account.address]
            ]
          }
        });
        callback();
      }
    }
  });

  const lateReveal = ({bidder, bid, subSalt}) => {
    writeContract({
      abi: vickreyAuctionBaseABI,
      address: data.auctionAddress,
      functionName: 'lateReveal',
      args: [bidder, bid, subSalt]
    });
  }
  const revealNoVerify = ({bidder, bid, subSalt}) => {
    writeContract({
      abi: vickreyAuctionBaseABI,
      address: data.auctionAddress,
      functionName: 'revealNoVerify',
      args: [bidder, bid, subSalt]
    });
  }
  const normalReveal = async ({bidder, bid, subSalt}) => {
    const proof = await getProof({bidder, bid, subSalt, chainId, auctionAddress: data.auctionAddress});
    if(proof) {
      writeContract({
        abi: vickreyAuctionBaseABI,
        address: data.auctionAddress,
        functionName: 'reveal',
        args: [bidder, bid, subSalt, proof.balance, proof.header, proof.accountProof]
      });
    }
  }

  const reveal = async () => {
    const ele = proof.trim().split("_");
    if(ele.length != 4) {
      toast.error("Wrong proof");
      return;
    }
    const auctionAddress = ele[0];
    const bidder = ele[1];
    const bid = ele[2];
    const salt = ele[3];
    if(ele.length != 4) {
      toast.error("Wrong proof");
      return;
    }
    if(!bidder || !salt || !bid){
      toast.error("Wrong input");
      return;
    }
    if(auctionAddress != data.auctionAddress) {
      toast.error("This proof is not for this auction");
      return;
    }
    const subSalt = keccak256(toUtf8Bytes(salt));

    if(data.startTime != "0" && data.startTime + data.revealDuration <= Date.now()/1000){
      lateReveal({bidder, bid, subSalt});
    } else {
      if(data.topBidder == "0x0000000000000000000000000000000000000000"){
        revealNoVerify({bidder, bid, subSalt});
      } else {
        const depositAddress = await getBidAddress({
          auctionAddress: auctionAddress, 
          bidder: bidder, 
          bid: bid, 
          subSalt
        });
        const create2Balance = await getBiddedAmount({create2Address: depositAddress, auctionAddress: data.auctionAddress, _bid: bid});
        if(create2Balance <= data.sndBid) {
          revealNoVerify({bidder, bid, subSalt});
        } else {
          normalReveal({bidder, bid, subSalt});
        }
      }
    }
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;

  const fileInputRef = useRef(null);
  const handleLoadFile = () => {
    fileInputRef.current.click();
  };
  const getFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProof(e.target.result);
    };
    reader.readAsText(file);
    event.target.value = null;
  }

  return (
    <Box display="flex" gap="10px" flexDirection={"column"}>
      <TextField
        id="outlined-multiline-static"
        label="Proof"
        multiline
        rows={4}
        value={proof}
        onChange={(e) => setProof(e.target.value)}
      />
      <Box>
        <Button variant="outlined" onClick={handleLoadFile} size="small" className="fontNomSize" fullWidth>
          Upload File
        </Button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={getFile} />
      </Box>
      <Box display={"flex"} gap={"10px"} alignItems={"center"}>
        <Button variant="contained" fontFamily="Poppins" size="small" className="fontNomSize"
          onClick={() => reveal()} fullWidth disabled={isLoading || !proof.trim()}
        >
          {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : (
            (data.startTime != "0" && data.startTime + data.revealDuration <= Date.now()/1000) ?
            "Late reveal" :
            "Confirm reveal"
          ) }
        </Button>
      </Box>
    </Box>
  )
}

export default VickreyRevealAction;