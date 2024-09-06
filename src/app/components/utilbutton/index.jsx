import React from "react";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Avatar, Box, Button, Skeleton, IconButton, Slide, Typography, Divider } from "@mui/material";
import { useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAppContext } from "src/context/useAppContext";
import WalletButton from "../walletbutton";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useEffect } from "react";
import { getBalanceOfAddress } from "src/api/contracts";
import { useCallback } from "react";
import { getWrapTokenBalance } from "src/api/contracts/interaction/WETHContract";
import { FailToLoad } from "../error";
import { formatEther, parseEther } from "viem";
import NumberInput from "../input/NumberInput";
import WETHContractABI from "src/api/contracts/abi/WETHABI.json";
import toast from "react-hot-toast";
import { addresses } from "src/api/contracts/addresses";
import { useRef } from "react";
import CloseIcon from '@mui/icons-material/Close';

const UtilButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toastId = useRef(null);
  const { colorMode: { currentMode } } = useAppContext();
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const [ETHBalance, setETHBalance] = useState(0);
  const [WETHBalance, setWETHBalance] = useState(0);
  const [loading, setLoading] = useState(1); // 0 là đang load, 1 là load xong, 2 là load lỗi
  const [inputAmount, setInputAmount] = useState(0);
  const [type, setType] = useState(0);

  const { data: hash, isPending, writeContract } = useWriteContract({
    mutation: {
      onError: (e) => {
        toast.error(e.shortMessage || e.message.slice(0, 50));
      },
      onSuccess: (x) => {
        initBalance();
      }
    }
  });

  const { isLoading: isConfirming, isSuccess, isError, error } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;

  const initBalance = useCallback(async () => {
    setLoading(0);
    if(account.address) {
      try{
        const balance = await getBalanceOfAddress(account.address);
        const wrapBalance = await getWrapTokenBalance({ userAddress: account.address});
        setWETHBalance(wrapBalance);
        setETHBalance(balance.value);
      } catch(e){
        console.log(e);
        setLoading(2);
      }
    } else {
      setETHBalance(0);
      setWETHBalance(0);
    }
    setLoading(1);
  }, [account.address]);

  useEffect(() => {
    initBalance();
  }, [initBalance]);

  useEffect(() => {
    if(toastId.current) {
      toast.dismiss(toastId.current);
    }
    if(isError){
      toast.error("Error::", error?.slice(0, 50));
    } else if(isSuccess) {  
      toast.dismiss(toastId.current);
      toast.success("Tx done!");
    } else if(isLoading) {
      toastId.current = toast.loading("Tx confirm....", { duration: 30000});
    }
  }, [isLoading, isError, isSuccess, error]);

  const convert = async () => {
    if((type == 1 && parseEther(inputAmount.toString()) > ETHBalance) || (type == 0 && parseEther(inputAmount.toString()) > WETHBalance)) {
      toast.error("Invalid amount");
      return;
    }
    if(type == 1) {
      // Convert ETH -> WETH
      writeContract({
        abi: WETHContractABI,
        address: addresses.WETH,
        functionName: 'deposit',
        value: parseEther(inputAmount.toString()),
      });
    } 
    if(type == 0) {
      // Convert WETH -> ETH
      writeContract({
        abi: WETHContractABI,
        address: addresses.WETH,
        functionName: 'withdraw',
        args: [parseEther(inputAmount.toString())],
      });
    }
  }

  return (
    <>
      <IconButton onClick={() => {
        if(account?.address == null) {
          openConnectModal();
        } else {
          setIsOpen(true);
        }
      }}>
        {
          account?.address != null ?
          <Avatar sx={{ width: 30, height: 30, backgroundColor: currentMode == "dark" ? "#f8f8f3" : "" }}>U</Avatar> :
          <AccountBalanceWalletIcon sx={{opacity: 0.8}}/>
        }
      </IconButton>
      {
        account.address != null &&
        // <Box sx={{
        //   position: "fixed", top: 0, bottom: 0, right: 0, zIndex: 1000,
        //   // backgroundColor: "#00000099",
        //   height: "100%", width: "100%",
        // }}>
        <>
          <Box sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, visibility: isOpen ? "visible" : "hidden", backgroundColor: "#00000099"}} onClick={() => setIsOpen(false)}></Box>
          <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
            <Box sx={{
              position: "fixed", top: 0, bottom: 0, right: 0, zIndex: 2000,
              backgroundColor: currentMode == "dark" ? "#282a36" : "white",
              height: "100%", width: "400px"
            }}>
              <Box height="100%" overflow="scroll">
                <Box pb={1} pt={1} textAlign={"right"}>
                  <IconButton onClick={() => setIsOpen(false)}>
                    <CloseIcon fontSize="small" sx={{transition: "0s all"}}/>
                  </IconButton>
                </Box>
                <Box display="flex" gap="30px" alignItems="center" justifyContent="center" flexDirection="column">
                  <WalletButton/>
                  <Divider width="50%"/>
                  <Box width="100%" px={3}>
                    <Typography sx={{width: "100%", fontFamily: "Poppins", fontWeight: "bold"}} className="titleSize">Wrap token</Typography>
                    <Box py={1.5}/>
                    {
                      loading == 2 &&
                      <FailToLoad size="4rem"/>
                    }
                    {
                      loading == 0 &&
                      <Box width="100%">
                        <Skeleton width="100%" height="100px"/>
                        <Skeleton width="100%" height="100px"/>
                        <Skeleton width="100%" height="50px"/>
                      </Box>
                    }
                    {
                      loading == 1 &&
                      <Box sx={{width: "100%"}}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap="7px">
                            <Typography sx={{fontWeight: "bold", fontFamily: "Poppins"}}>From&nbsp;</Typography>
                            <img style={{width: "20px", height: "20px"}} src={"/ETH.webp"}/>
                            <Typography>{type == 0 ? "WETH" : "ETH"}</Typography>
                          </Box>
                          <Typography sx={{opacity: "0.8"}}>Balance: {formatEther(type == 0 ? WETHBalance : ETHBalance).slice(0, 6)} {type == 0 ? "WETH" : "ETH"}</Typography>
                        </Box>
                        <Box pt={1}></Box>
                        <Box display={"flex"} alignItems="center" gap="15px">
                          <Box flexGrow={1}>
                            <NumberInput value={inputAmount} setValue={setInputAmount} fullWidth width="100%"/>
                          </Box>
                          <Typography className="fontSmallSize" sx={{cursor: "pointer"}} onClick={() => {
                            if(type == 0) {
                              setInputAmount(formatEther(WETHBalance.toString()));
                            } else {
                              setInputAmount(formatEther(ETHBalance));
                            }
                          }}>Max</Typography>
                        </Box>
                        <Box pt={0.5}></Box>
                        <Box textAlign="center">
                          <IconButton onClick={() => setType(!type)}>
                            <SwapVertIcon sx={{fontSize: "30px"}}/>
                          </IconButton>
                        </Box>
                        <Box pt={0.5}></Box>
                        <Box display={"flex"} alignItems="center" gap="15px">
                          <Box flexGrow={1}>
                        <NumberInput value={inputAmount} setValue={setInputAmount} fullWidth width="100%" disabled/>
                          </Box>
                          <Typography className="fontSmallSize" sx={{cursor: "pointer"}} onClick={() => {
                            if(type == 1) {
                              setInputAmount(formatEther(WETHBalance.toString()));
                            } else {
                              setInputAmount(formatEther(ETHBalance));
                            }
                          }}>Max</Typography>
                        </Box>
                        <Box pt={1}></Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap="7px">
                            <Typography sx={{fontWeight: "bold", fontFamily: "Poppins"}}>To&nbsp;</Typography>
                            <img style={{width: "20px", height: "20px"}} src={"/ETH.webp"}/>
                            <Typography>{type == 0 ? "ETH" : "WETH"}</Typography>
                          </Box>
                          <Typography sx={{opacity: "0.8"}}>Balance: {formatEther(type == 0 ? ETHBalance : WETHBalance).slice(0, 6)} {type == 0 ? "ETH" : "WETH"}</Typography>
                        </Box>
                        <Box pt={2}></Box>
                        <Button variant="contained" fullWidth disabled={!inputAmount || parseFloat(inputAmount) <= 0} onClick={convert}>Convert token</Button>
                        <Box pt={1}></Box>
                      </Box>
                    }
                  </Box>
                  <Divider width="50%"/>
                </Box>
              </Box>
            </Box>
          </Slide>
          </>
        // </Box>
      }
    </>
  )
}

export default UtilButton;