import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Empty } from "src/app/components/empty";
import { FailToLoad } from "src/app/components/error";
import CustomTooltip from "src/app/components/tooltip";
import useNFTDetailTransfer from "src/hooks/reactquery/useNFTDetailTransfer";
import { formatAddress } from "src/utils";
import { useAccount } from "wagmi";

const NFTTransfer = () => {
  const { data: nftDetailTransfers, error, isError, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useNFTDetailTransfer();
  const theme = useTheme();
  const account = useAccount();
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  useEffect(() => {
    if(nftDetailTransfers){
      let tempFiltered = [];
      nftDetailTransfers?.pages?.map((page) => {
        page.data.result.map((data) => {
          tempFiltered.push(data);
        })
      });
      setFilteredNFTs(tempFiltered);
    }
  }, [nftDetailTransfers]);

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }
  if(isLoading) {
    return (
      <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} py={4}>
        <div className="smallloading"></div>
      </Box>
    )
  }
  if((filteredNFTs?.length ?? 0) <= 0 && !hasNextPage){
    return <Box pt={0.5}>
      <Empty title={"There is no nft transfers!"}/>
    </Box>
  }
  return (
    <Box pt={2}>
      <Box display="flex" flexDirection={"column"} gap="10px" overflow={"scroll"} maxHeight={"710px"} sx={{overscrollBehavior: "none"}} pr={1}>
        {
          filteredNFTs.map((n, index) => (
            <Box display="flex" gap="8px" flexWrap={"nowrap"} key={`${index}`} justifyContent={"space-between"} sx={{borderRadius: "5px", cursor: "pointer", px: 2, py: 1,
              "&:hover": {
                backgroundColor: theme.palette.customBg
              }
            }}>
              <Box>
                <CustomTooltip text={n.from_address}>
                  <Typography>{account?.address?.toLowerCase() == n.from_address.toLowerCase() ? "You" : formatAddress(n.from_address, 3)}</Typography>
                </CustomTooltip>
                <Typography className="fontSmallSize" color={theme.palette.primary.main}>From</Typography>
              </Box>
              <Box>
                <CustomTooltip text={n.to_address}>
                  <Typography>{account?.address?.toLowerCase() == n.to_address.toLowerCase() ? "You" : formatAddress(n.to_address, 3)}</Typography>
                </CustomTooltip>
                <Typography className="fontSmallSize" color={theme.palette.primary.main}>To</Typography>
              </Box>
              <Box>
                <Typography>{(new Date(n.block_timestamp)).toLocaleDateString('en-US', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false 
                })}</Typography>
                <Typography className="fontSmallSize" color={theme.palette.primary.main}>Time</Typography>
              </Box>
              <Box>
                <Typography>{n.amount}</Typography>
                <Typography className="fontSmallSize" color={theme.palette.primary.main}>Amount</Typography>
              </Box>
            </Box>
          ))
        }
      </Box>
      <Box minHeight="40px">
        {
          hasNextPage && (
            <>
              {
                <Box textAlign={"center"} pt={1}>
                  <Button sx={{minHeight: "40px", minWidth: "115px"}} disabled={isFetchingNextPage} variant="outlined" disableRipple onClick={() => fetchNextPage()}>
                    {
                      isFetchingNextPage ? <CircularProgress style={{color: "#9e9fa6"}} size={"20px"}/> : "Load more..."
                    }
                  </Button>
                </Box>
              }
            </>
          )
        }
      </Box>
    </Box>
  )
}

export default NFTTransfer;