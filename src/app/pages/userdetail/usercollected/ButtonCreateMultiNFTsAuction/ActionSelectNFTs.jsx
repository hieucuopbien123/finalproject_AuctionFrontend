import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { formatAddress } from "src/utils";
import NumberInput from "src/app/components/input/NumberInput";
import ImageView from "../ImageView";
import { getBackupNFTName, getImgSrc } from "../../utils";
import { useAppContext } from "src/context/useAppContext";
import { useRef } from "react";
import { useEffect } from "react";
import CustomTooltip from "src/app/components/tooltip";

const ActionSelectNFTsImageView = ({data}) => {
  const [nftImage, _] = useState(data.resizedImageUrl);  
  const { imageCache: { imageCache } } = useAppContext();
  const imageCacheRef = useRef(imageCache);
  useEffect(() => {
    imageCacheRef.current = imageCache;
  }, [imageCache]);
  return (
    <Box sx={{borderRadius: "10px", overflow: "hidden"}}>
      <ImageView width="100%" nftImage={
        imageCacheRef.current?.[`${getImgSrc({data}).src ?? ""}_${400}`] ?
        {
          src: imageCacheRef.current?.[`${getImgSrc({data}).src ?? ""}_${400}`],
          type: "nft"
        } : nftImage
      } borderRadius="10px" overflow="hidden"/>
    </Box>
  )
}

const ActionSelectNFTs = (
  {data, nftAmount, setNFTAmount}
) => {
  const theme = useTheme();
  return (
    <Box display={"flex"} alignItems={"flex-start"} gap="25px" overflow={"scroll"} pb={1} className="biggerScrollbar" minHeight="310px">
      {
        data.map(d => (
          <Box maxWidth={"180px"} minWidth={"170px"}>
            <ActionSelectNFTsImageView data={d}/>
            <Typography fontWeight="bold" textAlign={"center"} className="bigTextSize limitText">{d.normalized_metadata.name ?? getBackupNFTName({d})}</Typography>
            <CustomTooltip text={d.token_address}>
              <Typography className="fontNomSize limitText" sx={{
                color: theme.palette.primary.main, fontFamily: "Poppins",
                textAlign: "center"
              }}>{`${d?.name ? d?.name : formatAddress(d.token_address)} ${!!d?.symbol ? `(${d?.symbol})` : ""}`}</Typography>
            </CustomTooltip>
            <Box pt={1}></Box>
            {
              <Box display={"flex"} alignItems={"center"} margin={"0 auto"} justifyContent={"center"}>
                <Typography className="fontNomSize">
                  Amount:&nbsp;&nbsp;
                </Typography>
                <NumberInput disabled={d.amount <= 1} width={"50px"} value={nftAmount?.[`${d.token_address.toLowerCase()}_${d.token_id}`] ?? d.amount} setValue={(e) => setNFTAmount({
                  ...nftAmount,
                  [`${d.token_address.toLowerCase()}_${d.token_id}`]: e
                })}/>
              </Box>
            }
          </Box>
        ))
      }
    </Box>
  )
}

export default ActionSelectNFTs;