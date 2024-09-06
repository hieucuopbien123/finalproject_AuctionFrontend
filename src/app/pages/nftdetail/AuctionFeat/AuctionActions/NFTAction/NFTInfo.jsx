import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "src/app/components/tooltip";
import { formatAddress } from "src/utils";
import { useAccount } from "wagmi";

const NFTInfo = ({data}) => {
  const theme = useTheme();
  const account = useAccount();
  const navigate = useNavigate();
  return (
    <Box>
      <Box py={1.5}/>
      <Box display="flex" flexDirection={"column"} gap="15px">
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>CONTRACT TYPE</Typography>
          <Typography>{data.contract_type}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>OWNER</Typography>
          <Typography>{data?.owners?.current ?? "-"}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>LAST METADATA SYNC</Typography>
          <Typography>{data?.last_metadata_sync}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>NAME</Typography>
          <Typography>{data?.name ?? data?.normalized_metadata?.name ?? "-"}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>MINTER ADDRESS</Typography>
          <CustomTooltip text={data?.minter_address}>
            <Typography sx={{cursor: "pointer"}} onClick={() => {
              if(data?.minter_address && data?.minter_address != "0x0000000000000000000000000000000000000000")
              navigate(`/userdetail/${data?.minter_address}`)
            }}>{data?.minter_address ? (account?.address?.toLowerCase() == data.minter_address.toLowerCase() ? "You" : formatAddress(data?.minter_address)) : "-"}</Typography>
          </CustomTooltip>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>TRANSFERS</Typography>
          <Typography>{data?.transfers?.total ?? 0}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography color={theme.palette.primary.main}>HEART</Typography>
          <Typography>{data?.heartNum ?? 0}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default NFTInfo;