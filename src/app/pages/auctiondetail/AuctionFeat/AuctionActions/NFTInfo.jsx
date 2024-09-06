import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "src/app/components/tooltip";
import { formatAddress } from "src/utils";

const NFTInfo = ({currentNFT}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection={"column"} gap="15px">
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>NAME</Typography>
        <Typography>{currentNFT.name ?? "-"}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>SYMBOL</Typography>
        <Typography>{currentNFT.symbol ?? "-"}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>TOKEN ADDRESS</Typography>
        <CustomTooltip text={currentNFT.tokenAddress}>
          <Typography sx={{cursor: "pointer"}} onClick={() => {
            if(currentNFT.tokenAddress && currentNFT.tokenAddress != "0x0000000000000000000000000000000000000000")
              navigate(`/collectiondetail/${currentNFT.tokenAddress}`)
          }}>{formatAddress(currentNFT.tokenAddress)}</Typography>
        </CustomTooltip>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>CONTRACT TYPE</Typography>
        <Typography>{currentNFT.contractType}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>COUNT</Typography>
        <Typography>{currentNFT.nftCount}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color={theme.palette.primary.main}>TOKEN ID</Typography>
        <Typography>{currentNFT.tokenId}</Typography>
      </Box>
    </Box>
  )
}

export default NFTInfo;