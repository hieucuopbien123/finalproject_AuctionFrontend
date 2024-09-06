import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Empty } from "src/app/components/empty";
import { FailToLoad } from "src/app/components/error";
import CustomTooltip from "src/app/components/tooltip";
import useNFTDetailOwners from "src/hooks/reactquery/useNFTDetailOwners";
import { formatAddress } from "src/utils";

const NFTOwner = () => {
  const { data: nftDetailOwners, error, isError, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useNFTDetailOwners();
  const [filteredOwners, setFilteredOwners] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    if(nftDetailOwners){
      let tempFiltered = [];
      nftDetailOwners?.pages?.map((page) => {
        page.data.map((data) => {
          tempFiltered.push(data);
        })
      });
      setFilteredOwners(tempFiltered);
    }
  }, [nftDetailOwners]);
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
  if((filteredOwners?.length ?? 0) <= 0 && !hasNextPage){
    return <Box pt={0.5}>
      <Empty title={"There is no auction!"}/>
    </Box>
  }
  return (
    <Box pt={3}>
      <Box display="flex" flexDirection={"column"} gap="10px" maxHeight={"710px"} overflow={"scroll"} sx={{overscrollBehavior: "none"}}>
        {
          filteredOwners.map((n, index) => (
            <Box key={`${index}_${n._id}`}>
              <Box display="flex" gap="10px" p={1} px={2} alignItems="center" sx={{borderRadius: "5px", cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.customBg
                }
              }}>
                <img src={n?.imageurl ? `${import.meta.env.VITE_API_SERVER}/uploads/${n?.imageurl}` : "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"}
                  width={"35px"} style={{borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover"}}
                />
                <Box>
                  <CustomTooltip text={n._id}>
                    <Typography fontFamily="Poppins">{n.username ? `${n.username} (${formatAddress(n._id)})` : formatAddress(n._id, 6)}</Typography>
                  </CustomTooltip>
                  <Typography fontFamily="Poppins" sx={{fontSize: "12px"}}>{n.amount} NFTs</Typography>
                </Box>
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

export default NFTOwner;