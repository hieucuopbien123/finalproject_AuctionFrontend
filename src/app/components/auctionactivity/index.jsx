import { Box, Button, CircularProgress, Divider, Typography, useTheme } from "@mui/material";
import React from "react";
import { getTokenName } from "src/api/contracts";
import { calculateRelativeTime, formatAddress } from "src/utils";
import { formatEther } from "viem";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { FailToLoad } from "src/app/components/error";
import { useState } from "react";
import { useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomTooltip from "../tooltip";
import { useAccount, useChainId } from "wagmi";
import { useNavigate } from "react-router-dom";
import { Empty } from "../empty";
import { useAppContext } from "src/context/useAppContext";
import { sepolia } from "@wagmi/core/chains";

const AuctionActivity = ({useTrade}) => {
  const account = useAccount();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: trades, error, isError, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useTrade();
  const [filteredTrades, setFilteredTrades] = useState([]);
  const { colorMode: { currentMode } } = useAppContext();
  const chainId = useChainId();
  useEffect(() => {
    if(trades){
      let tempFiltered = [];
      trades?.pages?.map((page) => {
        page.data.map((data) => {
          tempFiltered.push(data);
        })
      });
      setFilteredTrades(tempFiltered);
    }
  }, [trades]);

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }

  if(isLoading) {
    return <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} py={4}>
      <div className="smallloading"></div>
    </Box>
  }
  if((filteredTrades?.length ?? 0) <= 0){
    return <Box pt={2} pb={6}>
      <Empty title={"There is no activity!"}/>
    </Box>
  }
  return (
    <Box>
      <Box overflow="scroll" p={2}>
        {
          filteredTrades?.map((t,d) => (
            <Box key={`${t.hash}_${d}}`} minWidth="650px">
              <Box pt={1.5}/>
              <Box display="flex" gap="20px" alignItems="center" justifyContent={"space-between"}>
                <Box display="flex" gap="10px" flexWrap={"nowrap"}>
                  {
                    t.type == "0" &&
                    <>
                      <AddBoxIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        Create auction
                      </Typography>
                    </>
                  }
                  {
                    t.type == "2" &&
                    <>
                      <EditIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        Edit auction
                      </Typography>
                    </>
                  }
                  {
                    t.type == "3" &&
                    <>
                      <CancelIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        End auction
                      </Typography>
                    </>
                  }
                  {
                    t.type == "1" &&
                    <>
                      <AccountBalanceWalletIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        Bid auction
                      </Typography>
                    </>
                  }
                  {
                    t.type == "4" &&
                    <>
                      <VisibilityIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        Reveal auction
                      </Typography>
                    </>
                  }
                  {
                    t.type == "5" &&
                    <>
                      <PlayCircleOutlineIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
                      <Typography fontFamily="Poppins" fontWeight="bold" minWidth="130px">
                        Start reveal
                      </Typography>
                    </>
                  }
                </Box>
                <Box minWidth="110px">
                  <CustomTooltip text={t.hash}>
                    <a target="_blank" href={chainId == 11155111 ? `${sepolia.blockExplorers.default.url}/tx/${t.hash}` : ""}>
                      <Typography sx={{cursor: "pointer"}}>{formatAddress(t.hash)}</Typography>
                    </a>
                  </CustomTooltip>
                  <Typography className="fontSmallSize" color={theme.palette.primary.main}>Etherscan</Typography>
                </Box>
                <Box minWidth={"130px"}>
                  <CustomTooltip text={t.bidder.id}>
                    <Typography sx={{cursor: "pointer"}} onClick={() => {
                      if(t.bidder.id && t.bidder.id != "0x0000000000000000000000000000000000000000")
                        navigate(`/userdetail/${t.bidder.id}`);
                    }}>{account?.address?.toLowerCase() == t.bidder.id.toLowerCase() ? "You" : formatAddress(t.bidder.id)}</Typography>
                  </CustomTooltip>
                  <Typography className="fontSmallSize" color={theme.palette.primary.main}>User</Typography>
                </Box>
                <Box minWidth={"70px"}>
                  <Typography>{formatEther(t.price)} {getTokenName(t.auctionDetail.paymentToken).symbol}</Typography>
                  <Typography className="fontSmallSize" color={theme.palette.primary.main}>Amount</Typography>
                </Box>
                <Box minWidth={"130px"}>
                  <Typography>{calculateRelativeTime(t.timestamp*1000)}</Typography>
                  <Typography className="fontSmallSize" color={theme.palette.primary.main}>Time</Typography>
                </Box>
              </Box>
              <Box pt={1.5}/>
              <Divider/>
            </Box>
          ))
        }
        {
          hasNextPage && (
            <>
              {
                <Box textAlign={"center"} pt={2}>
                  <Button sx={{minHeight: "40px", minWidth: "115px"}} disabled={isFetchingNextPage} variant="outlined" disableRipple onClick={() => fetchNextPage()}>
                    {
                      isFetchingNextPage ? <CircularProgress style={{color: "#9e9fa6"}} size={"22px"}/> : "Load more..."
                    }
                  </Button>
                </Box>
              }
            </>
          )
        }
      </Box>
    </Box>
  )
}

export default AuctionActivity;