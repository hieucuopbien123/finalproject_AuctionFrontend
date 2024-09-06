import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { formatAddress } from "src/utils";
import { useAppContext } from "src/context/useAppContext";
import { useEffect } from "react";
import ApproveButton from "./ApproveButton";
import CustomTooltip from "src/app/components/tooltip";

const contractTypes = ["ERC721", "ERC1155"];

const ActionApproveNFTs = (
  {data, setIsApprovedAll, distinctAddresses}
) => {
  const { colorMode: { currentMode } } = useAppContext();
  const [approvedList, setApprovedList] = useState([]);
  useEffect(() => {
    if(data.map(d => d.token_address).every(element => approvedList.includes(element))) {
      setIsApprovedAll(true);
    } else {
      setIsApprovedAll(false);
    }
  }, [approvedList, setIsApprovedAll, data]);
  return (
    <Box display={"flex"} alignItems={"flex-start"} gap="25px" flexDirection={"column"} overflow={"scroll"} pb={1} height="310px">
      {
        (distinctAddresses.length == 1 && data[0].contractType == 1) ? 
        (
          <>Skip</>
        ) :
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Address</TableCell>
                <TableCell align="right">Approved state</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                distinctAddresses.map(d => (
                  <TableRow key={d.token_address} display={"flex"} gap="20px" alignItems="center" sx={{
                    "&:hover": {
                      backgroundColor: currentMode == "dark" ? "#777e90" : "#F4F4F4"
                    }
                  }}>
                    <TableCell>{d.name ?? d.symbol ?? contractTypes[d.contractType]}</TableCell>
                    <TableCell align="right">
                      <CustomTooltip text={d.token_address}>
                        <Typography>{formatAddress(d.token_address, 5)}</Typography>
                      </CustomTooltip>
                    </TableCell>
                    <TableCell align="right">
                      <ApproveButton {...{nftAddress: d.token_address, setApprovedList}}/>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Box>
  )
}

export default ActionApproveNFTs;