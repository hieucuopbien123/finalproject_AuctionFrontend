import React from "react";
import ImageView from "./ImageView";
import { Box, Typography } from "@mui/material";
import NumberInput from "src/app/components/input/NumberInput";
import CustomTooltip from "src/app/components/tooltip";

const ImageWithAmount = ({ data, nftAmount, setNFTAmount }) => {

  return <Box>
    <Box>
      <ImageView width="250px" nftImage={data.resizedImageUrl} borderRadius="10px" overflow="hidden"/>
    </Box>
    <Box pt={1}></Box>
    <Typography fontWeight="bold" textAlign={"center"} className="bigTextSize limitText">{data?.normalized_metadata?.name ?? getBackupNFTName({d})}</Typography>
    <CustomTooltip text={data?.token_address}>
      <Typography className="fontNomSize limitText" sx={{
        color: theme.palette.primary.main, fontFamily: "Poppins",
        textAlign: "center"
      }}>{`${data?.name ? data?.name : formatAddress(data?.token_address)} ${!!data?.symbol ? `(${data?.symbol})` : ""}`}</Typography>
    </CustomTooltip>
    <Box pt={1}></Box>
    {
      d.amount > 1 &&
      <Box display={"flex"} alignItems={"center"} margin={"0 auto"} justifyContent={"center"}>
        <Typography className="fontNomSize">
          Amount:&nbsp;&nbsp;
        </Typography>
        <NumberInput width={"50px"} value={nftAmount} setValue={setNFTAmount}/>
      </Box>
    }
  </Box>
};

export default ImageWithAmount;