import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useMemo } from "react";
import MultiImageView from "src/app/components/multiimageview";
import { useAppContext } from "src/context/useAppContext";
import useMultiImageOptimizer from "src/hooks/useMultiImageOptimizer";
import { getImage } from "src/utils";

const SealedBidV1CardHeader = ({data, hours, minutes, seconds}) => {
  const paramsOptimizedImg = useMemo(() => {
    return {
      originalImages: data.nftInfo.map(n => getImage(n.image)),
      optimizedToWidth: 300
    };
  }, [data]);
  const resizedImageUrls = useMultiImageOptimizer(paramsOptimizedImg);
  const { colorMode: { currentMode } } = useAppContext();

  return (
    <>
      <Box position="relative">
        <MultiImageView urls={resizedImageUrls} nftInfo={data.nftInfo} />
        {
          data.status == 0 && 
          <Box sx={{position: "absolute", right: "0", bottom: "0", backgroundColor: "rgba(44,44,44,0.7)", mb: "10px", mr: "5px", borderRadius: "10px", minWidth: "85px"}} textAlign={"center"}>
            <Typography sx={{px: "5px", py: "3px", fontFamily: "Poppins"}} color="white" fontSize="16px" fontWeight={"bold"}>{hours}:{minutes}:{seconds}</Typography>
          </Box>
        }
      </Box>
      {
        data.status == 1 ? 
        <Box position={"absolute"} top={5} right={5} px={1} py={0.5} 
          sx={{
            fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: currentMode == "dark" ? "white" : "#000000ba", 
            borderRadius: "20px", color: currentMode == "dark" ? "black" : "white"
          }} 
          className={clsx('fontSmallSize')}
        >
          Deleted
        </Box> : (
          data.startTime == "0" ?
          (
            <Box position={"absolute"} top={5} right={5} px={1} py={0.5} sx={{
              fontFamily: "Poppins", fontWeight: "bolder", 
              backgroundColor: data.endTime > Date.now()/1000 ? "#21d055db" : "#f13838e0", 
              borderRadius: "20px", color: "white"
            }} className={clsx('fontSmallSize')}
            >
              {data.endTime > Date.now()/1000 ? "Bid time" : "Reveal time"}
            </Box>
          ) : (
            data.startTime + data.revealDuration > Date.now()/1000 ?
            <Box position={"absolute"} top={5} right={5} px={1} py={0.5} sx={{
              fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "#f13838e0", 
              borderRadius: "20px", color: "white"
            }} className={clsx('fontSmallSize')}
            >
              Reveal time
            </Box> :
            <Box position={"absolute"} top={5} right={5} px={1} py={0.5} sx={{
              fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "rgba(214, 223, 246, 0.8)",
              borderRadius: "20px", color: "rgb(38, 99, 255)"
            }} className={clsx('fontSmallSize')}
            >
              Ended
            </Box>
          )
        )
      }
    </>
  )
}

export default SealedBidV1CardHeader;