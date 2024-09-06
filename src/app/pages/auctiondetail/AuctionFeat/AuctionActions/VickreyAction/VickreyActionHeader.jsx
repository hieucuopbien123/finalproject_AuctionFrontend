import { Box, Typography } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAccount } from "wagmi";
import useVickreyTimer from "src/hooks/auction/useVickreyTimer";
import { useAppContext } from "src/context/useAppContext";
import FlipClock from "src/app/components/flipclock";
import CustomTooltip from "src/app/components/tooltip";

const VickreyActionHeader = ({data, setRefetchTrigger}) => {
  const { hours, minutes, seconds, ended } = useVickreyTimer({data, callbackWhenEnd: () => setRefetchTrigger(p => !p)});
  const navigate = useNavigate();
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  return (
    <>        
      <Box onClick={() => {
        navigate("/auction/1");
      }} sx={{
        cursor: "pointer",
        "&:hover *": {
          opacity: 0.8,
        }
      }}>
        <Box display={"flex"} gap="10px" alignItems={"center"}>
          <KeyboardBackspaceIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
          <Typography fontFamily={"Poppins"}>Vickrey auction</Typography>
          {
            data.status == 1 ? 
            <Box px={1} py={0.5} 
              sx={{
                fontFamily: "Poppins", fontWeight: "bolder",backgroundColor: currentMode == "dark" ? "white" : "#000000ba", 
                borderRadius: "20px", color: currentMode == "dark" ? "black" : "white"
              }} 
              className={clsx('fontSmallSize')}
            >
              Deleted
            </Box> : (
              data.startTime == "0" ?
              (
                <Box px={1} py={0.5} sx={{
                  fontFamily: "Poppins", fontWeight: "bolder", 
                  backgroundColor: data.endTime > Date.now()/1000 ? "#21d055db" : "#f13838e0", 
                  borderRadius: "20px", color: "white"
                }} className={clsx('fontSmallSize')}
                >
                  {data.endTime > Date.now()/1000 ? "Bid time" : "Reveal time"}
                </Box>
              ) : (
                data.startTime + data.revealDuration > Date.now()/1000 ?
                <Box px={1} py={0.5} sx={{
                  fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "#f13838e0", 
                  borderRadius: "20px", color: "white"
                }} className={clsx('fontSmallSize')}
                >
                  Reveal time
                </Box> :
                <Box px={1} py={0.5} sx={{
                  fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "rgba(214, 223, 246, 0.8)",
                  borderRadius: "20px", color: "rgb(38, 99, 255)"
                }} className={clsx('fontSmallSize')}
                >
                  Ended
                </Box>
              )
            )
          }
        </Box>
      </Box>
      <Box pt={1}/>
      <CustomTooltip text={data.auctionAddress}>
        <Typography
          className="fontSuperSize" fontWeight={"bold"} fontFamily={"Poppins"}
        >
          {formatAddress(data.auctionAddress)}
        </Typography>
      </CustomTooltip>
      <Box pt={1}/>
      <Box>
      <CustomTooltip text={data?.auctionCreator}>
        <Typography fontFamily={"Poppins"} sx={{cursor: "pointer"}} onClick={() => {
          if(data?.auctionCreator && data?.auctionCreator != "0x0000000000000000000000000000000000000000")
          navigate(`/userdetail/${data?.auctionCreator}`)
        }}>
          <span style={{opacity: 0.8}}>Owned by</span>&nbsp;{data?.auctionCreator.toLowerCase() == account?.address?.toLowerCase() ? "You" : formatAddress(data?.auctionCreator)}
        </Typography>
      </CustomTooltip>
      </Box>
      {
        !ended && data.status == 0 &&
        <>
          <Box pt={3}/>
          <Box sx={{mb: "10px", mr: "5px", borderRadius: "10px", minWidth: "85px",
            width: "100%",
          }} >
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .tick": {
                fontSize: "35px",
              }
            }}>
              <FlipClock value={hours} />
              <Typography sx={{fontSize: "35px"}}>:</Typography>
              <FlipClock value={minutes} />
              <Typography sx={{fontSize: "35px"}}>:</Typography>
              <FlipClock value={seconds} />
            </Box>
          </Box>
        </>
      }
      <Box pt={3}/>
    </>
  )
}

export default VickreyActionHeader;