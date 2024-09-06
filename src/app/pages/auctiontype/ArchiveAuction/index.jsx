import React from "react";
import ArchiveHeader from "./ArchiveHeader";
import { Box } from "@mui/material";
import ArchiveDetail from "./ArchiveDetail";
import { useAccount } from "wagmi";

const ArchiveAuction = () => {
  const account = useAccount();
  return (
    <Box className="animate__animated animate__fadeIn" pt={2} pb="42px">
      <ArchiveHeader/>
      <Box py={1}/>
      <ArchiveDetail account={account}/>
    </Box>
  )
}

export default ArchiveAuction;