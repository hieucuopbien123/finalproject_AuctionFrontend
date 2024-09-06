import { Box, IconButton, useMediaQuery } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getImage } from "src/utils";
import Slider from "react-slick";
import OneImage from "src/app/components/multiimageview/OneImage";
import { useQueryClient } from "@tanstack/react-query";
import RefetchButton from "src/app/components/button/RefetchButton";
import { debounce } from "lodash";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect } from "react";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import useCheckAuctionHeart from "src/hooks/reactquery/useCheckAuctionHeart";
import { postAuctionHeart } from "src/api/auction";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style}}
      onClick={onClick}
    />
  );
}

const AuctionImages = ({data, setCurrentNFT}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const matches = useMediaQuery('(max-width:1100px)');
  const queryClient = useQueryClient();
  const settings = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    infinite: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (_, newIndex) => {
      setCurrentNFT(data.nftInfo[newIndex]);
    }
  };

  const account = useAccount();
  const { data: heartData } = useCheckAuctionHeart({auctionAddress: data.auctionAddress, userAddress: account?.address ?? ""});
  const isHeart = useDebounce(heartData?.result, 3000);
  const [heartIsTrue, setHeart] = useState(heartData?.result ?? false);
  useEffect(() => {
    setHeart(isHeart);
  }, [isHeart]);
  const debouncedRefetch = useCallback(debounce(
    async (value) => {
      try{
        await postAuctionHeart({auctionAddress: data.auctionAddress, userAddress: account?.address ?? "", heart: value});
        queryClient.invalidateQueries({queryKey: ["useCheckAuctionHeart", data.auctionAddress, account?.address]});
        queryClient.invalidateQueries({queryKey: ["auctionDetail", data.auctionAddress]});
      } catch (e) {
        console.log(e);
      }
    }, 3000), [account.address, data.token_address, data.token_id, queryClient]); 

  return (
    <Box sx={{
      gridArea: "B",
      backgroundImage: currentMode == "dark" ? "repeating-linear-gradient(45deg, #282a36, #282a36 13px, #393838 13px, #393838 14px)" : "repeating-linear-gradient(45deg, #ffffff, #ffffff 13px, #f0e9eb 13px, #f0e9eb 14px)",
      backgroundSize: "40px 40px"
    }} borderLeft={"1px solid"} py={!matches ? 8 : 4} borderBottom={"1px solid"} 
      borderColor={!matches ? (currentMode == "dark" ? "#2f2f2f" : "#e6e8ec") : "transparent"} 
      // backgroundColor={!matches ? (currentMode == "dark" ? "#23262f" : "red") : "transparent"}
    >
      <Box textAlign={"center"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Box width={"100%"} maxWidth="740px" px={"30px"}>
          <Slider {...settings}>
            {
              data.nftInfo.map((n, index) => (
                <Box key={`${n.image}_${index}`}>
                  <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <OneImage src={getImage(n.image)} maxWidth="640px"/>
                  </Box>
                </Box>
              ))
            }
          </Slider>  
        </Box>
        <Box py={1}></Box>
        <Box 
          px={1} py={0.5} border="1px solid"
          borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"} 
          display={"inline-block"} width={"fit-content"} borderRadius={"10px"}
          backgroundColor={currentMode == "dark" ? "#1d1d22" : "white"}
        >
          <RefetchButton message="Refetched auctions detail" size="small"
            refetchFunc={() => {
              queryClient.invalidateQueries({queryKey: ["auctionDetail", data.auctionAddress]});
              queryClient.invalidateQueries({queryKey: ["useOneAuctionTrades", data.auctionAddress]});
            }}
          />
          &nbsp;
          <IconButton onClick={async () => {
            if(account.address){
              setHeart(!heartIsTrue);
              debouncedRefetch(!heartIsTrue);
            } else {
              toast("Connection your wallet first!");
            }
          }}>
            {
              heartIsTrue ? 
              <FavoriteIcon sx={{color: "red"}}/>
              : 
              <FavoriteBorderIcon />
            }
          </IconButton>
          &nbsp;
          <IconButton>
            <MoreHorizIcon size="large"/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default AuctionImages;