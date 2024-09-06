import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import sealBidAuctionV2ABI from "src/api/contracts/abi/SealedBidAuctionV2BaseABI.json";
import { keccak256 } from "viem";
import toast from "react-hot-toast";
import { useApproveToken } from "src/hooks/useApproveToken";
import { useCallback } from "react";
import { canConvertToBigInt } from "src/utils";
import { useEffect } from "react";

const SealedBidV2RevealAction = ({ callback, data }) => {
  const [proof, setProof] = useState("");
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
              ["auction", [4]],
              ["auction", [1000]],
              ["auctionDetail", data.auctionAddress],
              ["auctionStats", 4],
              ["user", account.address],
              ["userNFTs", account.address],
            ]
          }
        });
        callback();
      }
    }
  });
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

  const [bidX, setBid] = useState(0);
  useEffect(() => {
    const ele = proof.trim().split("_");
    if(ele?.[2] && canConvertToBigInt(ele?.[2])){
      setBid(ele?.[2]);
    }
  }, [proof]);
  const callRevealAuction = useCallback(() => {
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
    const subSalt = keccak256(salt);
    writeContract({
      abi: sealBidAuctionV2ABI,
      address: data.auctionAddress,
      functionName: 'reveal',
      args: [bid, subSalt],
    });
  }, [data.auctionAddress, writeContract, proof]);
  const { callWithApprove, isLoadingApprove } = useApproveToken({
    callback: callRevealAuction,
    paymentToken: data.paymentToken,
    approvedAddress: data.auctionAddress,
    amount: BigInt(bidX.toString()),
  });

  const revealSealedBidV2Auction = async () => {
    if(data.paymentToken == "0x0000000000000000000000000000000000000000"){
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
      const subSalt = keccak256(salt);
      writeContract({
        abi: sealBidAuctionV2ABI,
        address: data.auctionAddress,
        functionName: 'reveal',
        args: [bid, subSalt],
        value: bid, 
      });
    } else {
      callWithApprove();
    }
  };

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending || isLoadingApprove;
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent="space-around" gap={"10px"}>
      <Box pt={0.5}/>
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

      <Box display={"flex"} gap="20px" alignItems={"center"}>
        <Button className="fontNomSize" variant="contained" fontFamily="Poppins"
          onClick={() => revealSealedBidV2Auction()} disabled={isLoading || !proof.trim()} fullWidth size="small"
        >
          {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : "Confirm reveal" }
        </Button>
      </Box>
    </Box>
  )
}

export default SealedBidV2RevealAction;