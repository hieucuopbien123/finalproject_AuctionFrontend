import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { formatAddress } from "src/utils";
import { useNavigate } from "react-router-dom";
import useEnglishTimer from "src/hooks/auction/useEnglishTimer";
import clsx from "clsx";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAccount } from "wagmi";
import { useAppContext } from "src/context/useAppContext";
import FlipClock from "src/app/components/flipclock";
import CustomTooltip from "src/app/components/tooltip";

const EnglishActionHeader = ({data, setRefetchTrigger}) => {
  const { hours, minutes, seconds, ended } = useEnglishTimer({data, callbackWhenEnd: () => setRefetchTrigger(p => !p)});
  const isOnGoing = Date.now()/1000 > (data.startTime);
  const navigate = useNavigate();
  const account = useAccount();
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  return (
    <>        
      <Box onClick={() => {
        navigate("/auction/0");
      }} sx={{
        cursor: "pointer",
        "&:hover *": {
          opacity: 0.8,
        }
      }}>
        <Box display={"flex"} gap="10px" alignItems={"center"}>
          <KeyboardBackspaceIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
          <Typography fontFamily={"Poppins"}>English auction</Typography>
          {
            data.status == 1 ? 
            <Box px={1} py={0.5} 
              sx={{
                fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: currentMode == "dark" ? "white" : "#000000ba", 
                borderRadius: "20px", color: currentMode == "dark" ? "black" : "white"
              }} 
              className={clsx('fontSmallSize')}
            >
              Deleted
            </Box> : (
              !isOnGoing ?
              <Box px={1} py={0.5} 
                sx={{
                  fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "#777e90e0", borderRadius: "20px", color: "white"
                }} 
                className={clsx('fontSmallSize')}
              >
                Sealed
              </Box> : (
                ended ?
                <Box px={1} py={0.5} sx={{
                    fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "rgba(214, 223, 246, 0.8)",
                    borderRadius: "20px", color: "rgb(38, 99, 255)"
                  }} 
                  className={clsx('fontSmallSize')}
                >
                  Ended
                </Box> : 
                <Box px={1} py={0.5} 
                  sx={{
                    fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "#21d055db", borderRadius: "20px", color: "white"
                  }} 
                  className={clsx('fontSmallSize')}
                >
                  Bid time
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
      <Box display="flex">
        <CustomTooltip text={data?.auctionCreator}>
          <Typography fontFamily={"Poppins"}>
            <span style={{opacity: 0.8}}>Owned by</span>&nbsp;{data?.auctionCreator.toLowerCase() == account?.address?.toLowerCase() ? "You" : formatAddress(data?.auctionCreator)}
          </Typography>
        </CustomTooltip>
      </Box>
      {
        !ended && data.status == 0 &&
        <>
          <Box pt={3}/>
          {
            !isOnGoing ?
            <Box sx={{fontFamily: "Poppins", color: theme.palette.primary.main, textAlign: "center"}} className="fontSmallSize">
              Start after
            </Box> : (
              <Box sx={{fontFamily: "Poppins", color: theme.palette.primary.main, textAlign: "center"}} className="fontSmallSize">
                End after
              </Box>
            )
          }
          <Box pt={1}/>
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

export default EnglishActionHeader;