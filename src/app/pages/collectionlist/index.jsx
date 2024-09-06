import { Box, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import useCollectionList from "src/hooks/reactquery/useCollectionList";
import { FailToLoad } from "src/app/components/error";
import PageLoading from "src/app/components/loading";
import { formatAddress } from "src/utils";
import { formatEther } from "viem";
import OneImage from "src/app/components/multiimageview/OneImage";
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/useAppContext";
import CustomTooltip from "src/app/components/tooltip";

const rowsPerPage = 50;

const CollectionList = () => {
  const [page, setPage] = React.useState(0);
  const navigate = useNavigate();
  const { colorMode: { currentMode } } = useAppContext();
  const { data: collectionList, isError, error, isLoading } = useCollectionList({ first: rowsPerPage, skip: rowsPerPage*page });
  if(isLoading) {
    return <PageLoading/>
  }
  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  return (
    <Container maxWidth={"xxl"}>
      <Box py={1}/>
      <Typography fontWeight={"bolder"} className="fontSuperSize" fontFamily={"Poppins"}>
        Collections
      </Typography>
      <Box py={1}/>
      <Box px={2}>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{pb: 1, border: 0, fontFamily: "Poppins", fontWeight: "bold", color: "#777e90", fontSize: "12px"}}>Collection</TableCell>
                <TableCell sx={{pb: 1, border: 0, fontFamily: "Poppins", fontWeight: "bold", color: "#777e90", fontSize: "12px", whiteSpace: "nowrap"}} align="center">Auction count</TableCell>
                <TableCell sx={{pb: 1, border: 0, fontFamily: "Poppins", fontWeight: "bold", color: "#777e90", fontSize: "12px", whiteSpace: "nowrap"}} align="right">Auction volume</TableCell>
                <TableCell sx={{pb: 1, border: 0, fontFamily: "Poppins", fontWeight: "bold", color: "#777e90", fontSize: "12px", whiteSpace: "nowrap"}} align="right">Contract type</TableCell>
                <TableCell sx={{pb: 1, border: 0, fontFamily: "Poppins", fontWeight: "bold", color: "#777e90", fontSize: "12px", whiteSpace: "nowrap"}} align="right">Synced at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collectionList?.data?.map((row, index) => (
                <TableRow
                  key={row.token_address}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer", transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: currentMode == "dark" ? "#23262f" : "#e6e8ec"
                    },
                  }}
                  onClick={() => {
                    if(row.token_address && row.token_address != "0x0000000000000000000000000000000000000000")
                    navigate(`/collectiondetail/${row.token_address}`)}
                  }
                >
                  <TableCell align="left" sx={{py: 1.5, whiteSpace: "nowrap", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"}} >
                    <Box display={"flex"} gap="10px" alignItems={"center"}>
                      <Typography style={{color: "#777e90"}} sx={{fontFamily: "Poppins", fontWeight: "bold", minWidth: "20px"}}>{(index + 1) + rowsPerPage * page}</Typography>
                      <Box px={0.5}></Box>
                      <OneImage width="40px" borderRadius="50%" src={row?.collection_logo ?? row?.collection_banner_image ?? "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"}/>
                      <CustomTooltip text={row?.token_address}>
                        <Typography className="fontNomSize" sx={{fontFamily: "Poppins", fontWeight: "bold", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", wordBreak: "break-all"}} component="th" scope="row">
                          {row?.name ? row?.name : formatAddress(row?.token_address, 3)} {!!row?.symbol ? `(${row?.symbol})` : null}
                        </Typography>
                      </CustomTooltip>
                      {
                        row?.verified_collection == true &&
                        <VerifiedIcon fontSize="10px" sx={{color: "#4589FF"}}/>
                      }
                    </Box>
                  </TableCell>
                  <TableCell className="fontNomSize" sx={{py: 1.5, fontFamily: "Poppins", fontWeight: "bold", whiteSpace: "nowrap"}} align="center">{row.auctionCount}</TableCell>
                  <TableCell className="fontNomSize" sx={{py: 1.5, fontFamily: "Poppins", fontWeight: "bold", whiteSpace: "nowrap"}} align="right">{formatEther(row.auctionVol)} USD</TableCell>
                  <TableCell className="fontNomSize" sx={{py: 1.5, fontFamily: "Poppins", fontWeight: "bold", whiteSpace: "nowrap"}} align="right">{row.contract_type}</TableCell>
                  <TableCell className="fontNomSize" sx={{py: 1.5, fontFamily: "Poppins", fontWeight: "light", whiteSpace: "nowrap", borderTopRightRadius: "10px", borderBottomRightRadius: "10px"}} align="right">{row.synced_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box py={2}></Box>
          <Box display={"flex"} gap="20px" justifyContent={"center"}>
            <IconButton disabled={page == 0} disableRipple onClick={() => setPage(page - 1)}>
              <ArrowBackIosIcon/>
            </IconButton>
            <IconButton disabled={(collectionList?.data?.length ?? 0)< rowsPerPage} disableRipple onClick={() => setPage(page + 1)}>
              <ArrowForwardIosIcon/>
            </IconButton>
          </Box>
        </TableContainer>
      </Box>
    </Container>
  )
}

export default CollectionList;