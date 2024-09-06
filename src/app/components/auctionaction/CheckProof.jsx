import { Box, Button, CircularProgress, IconButton, TextField, Typography, useTheme } from "@mui/material";
import React from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";
import { useRef } from "react";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import { getBidAddress, getRevealBlockNum } from "src/api/contracts/interaction/VickreyAuctionBase";
import { getTokenName } from "src/api/contracts";
import { formatEther } from "viem";
import toast from "react-hot-toast";

const CheckProof = () => {
  const theme = useTheme();
  const [proof, setProof] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  const checkProof = async () => {
    setLoading(true);
    try{
      const ele = proof.trim().split("_");
      if(ele.length != 4) {
        toast.error("Wrong proof");
        return;
      }
      const auctionAddress = ele[0];
      const bidder = ele[1];
      const bid = ele[2];
      const salt = ele[3];
      if(!bidder || !salt || !bid){
        toast.error("Wrong input");
        return;
      }
      const subSalt = keccak256(toUtf8Bytes(salt));

      const depositAddress = await getBidAddress({
        auctionAddress: auctionAddress, 
        bidder: bidder, 
        bid: bid, 
        subSalt
      });

      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA}`);
      const create2CurrentBalance = await provider.getBalance(depositAddress.address);
      const blockNum = await getRevealBlockNum({auctionAddress});
      let create2Balance = create2CurrentBalance;
      if(blockNum != 0n){
        create2Balance = await provider.getBalance(depositAddress.address, parseInt(blockNum));
      }
      setResult({
        auctionAddress: auctionAddress,
        userAddress: bidder,
        userBiddedAmount: create2Balance < bid ? create2Balance : bid,
        maxBid: bid,
        create2Balance: create2CurrentBalance,
        depositAddress: depositAddress.address
      });
    } catch(e) {
      toast.error(e?.message?.slice(0, 50));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent={"space-between"} alignItems="center" sx={{opacity: 0.8, cursor: "pointer",
        "&:hover": {
          opacity: 0.5,
        }
      }} onClick={() => setOpen(!open)}>
        <Typography sx={{fontFamily: "Poppins", fontWeight: "bold"}} className="bigTextSize">Check proof</Typography>
        <KeyboardArrowDownIcon/>
      </Box>
      {
        open && 
        <Box display="flex" flexDirection="column" gap="10px" py={1} pt={2} alignItems={"center"}>
          <TextField
            id="outlined-multiline-static"
            label="Proof"
            multiline
            fullWidth
            rows={4}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
          />
          <Box width="100%">
            <Button variant="outlined" onClick={handleLoadFile} size="small" className="fontSmallSize" fullWidth>
              Upload File
            </Button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={getFile} />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <IconButton onClick={() => checkProof()} sx={{border: "1px solid", borderColor: theme.palette.primary.main}} disabled={loading}>
              {loading ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : <ArrowDownwardIcon/> }
            </IconButton>
          </Box>
            <Box sx={{p: 1.5, border: "1px solid", borderColor: theme.palette.primary.main, borderRadius: "4px", width: "100%", minHeight: "117px"}}>
              {
                result && <>
                  <Typography sx={{fontFamily: "Poppins", fontWeight: "light", wordBreak: "break-all"}}>
                    User address: {result.userAddress}
                  </Typography>
                  <Typography sx={{fontFamily: "Poppins", fontWeight: "light", wordBreak: "break-all"}}>
                    Auction address: {result.auctionAddress}
                  </Typography>
                  <Typography sx={{fontFamily: "Poppins", fontWeight: "light", wordBreak: "break-all"}}>
                    Deposit address: {result.depositAddress}
                  </Typography>
                  <Typography sx={{fontFamily: "Poppins", fontWeight: "light", wordBreak: "break-all"}}>
                    Max bid amount: {formatEther(result.userBiddedAmount.toString())} {getTokenName("0x0000000000000000000000000000000000000000").symbol}
                  </Typography>
                  <Typography sx={{fontFamily: "Poppins", fontWeight: "light", wordBreak: "break-all"}}>
                    Create2 balance: {formatEther(result.create2Balance.toString())} {getTokenName("0x0000000000000000000000000000000000000000").symbol}
                  </Typography>
                </>
              }
            </Box>
        </Box>
      }
    </Box>
  )
}

export default CheckProof;