import { Box, IconButton, useMediaQuery } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getImage } from "src/utils";
import OneImage from "src/app/components/multiimageview/OneImage";
import { useQueryClient } from "@tanstack/react-query";
import RefetchButton from "src/app/components/button/RefetchButton";
import { postNFTHeart } from "src/api/collection";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import useCheckNFTHeart from "src/hooks/reactquery/useCheckNFTHeart";
import { debounce } from "lodash";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect } from "react";
import { useCallback } from "react";

const AuctionImages = ({data}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const queryClient = useQueryClient();
  const matches = useMediaQuery('(max-width:1100px)');
  const account = useAccount();
  const { data: heartData } = useCheckNFTHeart({collectionAddress: data.token_address, userAddress: account?.address ?? "", nftId: data.token_id});
  const isHeart = useDebounce(heartData?.result, 3000);
  const [heartIsTrue, setHeart] = useState(heartData?.result ?? false);
  useEffect(() => {
    setHeart(isHeart);
  }, [isHeart]);
  const debouncedRefetch = useCallback(debounce(
    async (value) => {
      await postNFTHeart({collectionAddress: data.token_address, userAddress: account.address, nftId: data.token_id, heart: value});
      queryClient.invalidateQueries({queryKey: ["useCheckNFTHeart", data.token_address, account.address, data.token_id]});
      queryClient.invalidateQueries({queryKey: ["nftDetail", data.token_address, data.token_id]});
    }, 3000), [account.address, data.token_address, data.token_id, queryClient]); 
  return (
    <Box sx={{gridArea: "B",
      backgroundImage: currentMode == "dark" ? "repeating-linear-gradient(45deg, #282a36, #282a36 13px, #393838 13px, #393838 14px)" : "repeating-linear-gradient(45deg, #ffffff, #ffffff 13px, #f0e9eb 13px, #f0e9eb 14px)",
      backgroundSize: "40px 40px"}} borderLeft={"1px solid"} py={!matches ? 5 : 2} borderBottom={"1px solid"} 
      borderColor={!matches ? (currentMode == "dark" ? "#2f2f2f" : "#e6e8ec") : "transparent"} 
      backgroundColor={!matches ? (currentMode == "dark" ? "#23262f" : "#fcfcfd") : "transparent"}
    >
      <Box textAlign={"center"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Box width={"100%"} maxWidth="740px" px={"30px"}>
          <Box>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <OneImage src={getImage(data.normalized_metadata.image)} maxWidth="640px"/>
            </Box>
          </Box>
        </Box>
        <Box py={1}></Box>
        <Box 
          px={1} py={0.5} border="1px solid"
          borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"} 
          display={"inline-block"} width={"fit-content"} borderRadius={"10px"}
          backgroundColor={currentMode == "dark" ? "#1d1d22" : "white"}
        >
          <RefetchButton message="Refetched nft detail" size="small"
            refetchFunc={() => {
              queryClient.invalidateQueries({queryKey: ["nftDetail", data.token_address]})
            }}
          />
          &nbsp;
          <IconButton>
            {
              heartIsTrue ? 
              <FavoriteIcon onClick={async () => {
                if(account.address){
                  setHeart(!heartIsTrue);
                  debouncedRefetch(!heartIsTrue);
                } else {
                  toast("Connection your wallet first!");
                }
              }} sx={{color: "red"}}/>
              : 
              <FavoriteBorderIcon onClick={async () => {
                if(account.address){
                  setHeart(!heartIsTrue);
                  debouncedRefetch(!heartIsTrue);
                } else {
                  toast("Connection your wallet first!");
                }
              }}/>
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