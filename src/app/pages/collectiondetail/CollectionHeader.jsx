import { Box, IconButton, Typography, Skeleton } from "@mui/material";
import React, { memo, useState } from "react";
import { useParams } from "react-router-dom";
import RoundImage from "src/app/components/roundimage";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatAddress, getOnlyAuctionNameFromType } from "src/utils";
import { RiGlobalLine } from "react-icons/ri";
import ShareIcon from '@mui/icons-material/Share';
import { IoCopyOutline } from "react-icons/io5";
import { useAppContext } from "src/context/useAppContext";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import clsx from "clsx";
import RefetchButton from "src/app/components/button/RefetchButton";
import toast from "react-hot-toast";
import { FailToLoad } from "src/app/components/error";
import useCollectionDetail from "src/hooks/reactquery/useCollectionDetail";
import { formatEther } from "viem";
import SyncIcon from '@mui/icons-material/Sync';
import CustomTooltip from "src/app/components/tooltip";
import { resyncMetadata } from "src/api/collection";
import { debounce } from "lodash";

const CollectionHeader = memo(() => {
  const { colorMode: { currentMode } } = useAppContext();
  const [_, copy] = useCopyToClipboard();
  const [isExpandDes, setIsExpanDes] = useState(false);

  let { address } = useParams();
  const debouncedResync = debounce(() => resyncMetadata({collectionAddress: address}), 2000);
  const { data: collectionDetail, isLoading, isError, refetch, error } = useCollectionDetail();

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
  }

  if(isLoading) {
    return <Box py={1} pb={5}> 
      <Box display={"flex"}justifyContent={"space-between"} gap="20px" width={"100%"} alignItems="flex-start">
        <Box display="flex" gap="20px" alignItems="flex-start" flexGrow={1}>
          <Box width={"25%"} sx={{aspectRatio: "1/1"}} maxWidth={"120px"} minWidth={"96px"}>
            <Skeleton variant="circular" width={"100%"} height={"100%"}/>
          </Box>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"baseline"} pb={1}>
              <Skeleton variant="rounded" width={"100%"} height={"40px"}/>
            </Box>
            <Box alignItems={"center"} pb={1}>
              <Skeleton variant="rounded" width={"50%"} height={"20px"}/>
            </Box>
            <Box alignItems={"center"} pb={1}>
              <Skeleton variant="rounded" width={"80%"} height={"50px"}/>
            </Box>
            
            <Box py={1}></Box>
            <Box display={"flex"} gap="30px" flexWrap={"wrap"}>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
              <Box>
                <Skeleton variant="rounded" width={"130px"} height={"55px"}/>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} gap={"4px"} alignItems={"center"} flexWrap={"nowrap"}>
          <Skeleton variant="rounded" width={"200px"} height={"40px"}/>
        </Box>
      </Box>
    </Box>;
  }

  return (
    <Box py={1} pb={5}> 
      <Box display={"flex"}justifyContent={"space-between"} gap="20px" width={"100%"} alignItems="flex-start">
        <Box display="flex" gap="20px" alignItems="flex-start" flexGrow={1}>
          <RoundImage url={collectionDetail?.data?.collection_logo ?? collectionDetail?.data?.collection_banner_image}/>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"baseline"}>
              <CustomTooltip text={collectionDetail?.data?.token_address}>
                <Typography sx={{
                  fontFamily: "Poppins", fontWeight: "bold",
                }} className="fontSuperSize limitText">
                  {`${collectionDetail?.data?.name ? collectionDetail?.data?.name : formatAddress(collectionDetail?.data?.token_address)} ${!!collectionDetail?.data?.symbol ? `(${collectionDetail?.data?.symbol})` : ""}`}
                </Typography>
              </CustomTooltip>
              &nbsp;
              {
                collectionDetail?.data?.verified_collection &&
                <VerifiedIcon className="titleSize" sx={{color: "#4589FF"}}/>
              }
            </Box>
            <Box display={"flex"} gap={"10px"} alignItems={"center"}>
              <Box display={"flex"} alignItems={"center"} gap="5px" border="1px solid gray" 
                borderRadius={"20px"} p="5px"
                backgroundColor={currentMode === "dark"? "black" : "white"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: currentMode === "dark"? "white" : "black",
                    color: currentMode === "dark"? "black" : "white",
                    "& p": {
                      color: currentMode === "dark"? "black" : "white",
                    }
                  }
                }}
                onClick={() => {
                  copy(address);
                  toast.success("Copied");
                }}
              >
                <CustomTooltip text={address}>
                  <Typography fontSize={"12px"}>{formatAddress(address)}</Typography>
                </CustomTooltip>
                <IoCopyOutline fontSize="small"/>
              </Box>
              <Typography><span style={{fontWeight: "bold"}}>{collectionDetail?.data?.owners}</span> owners</Typography>
              ·
              <Typography><span style={{fontWeight: "bold"}}>{collectionDetail?.data?.total_tokens}</span> NFTs</Typography>
              {
                collectionDetail?.data?.contract_type && 
                <Typography>· &nbsp;{collectionDetail?.data?.contract_type}</Typography>
              }
              ·
              <Typography><span style={{fontWeight: "bold"}}>{collectionDetail?.data?.transfers}</span> transfers</Typography>
            </Box>
            {
              !!collectionDetail?.data?.description && 
              <>
                <Box py={1}></Box>
                <Box display={"flex"} width={"80%"}>
                  <Typography className={clsx(!isExpandDes && "limitText")}>
                    {collectionDetail?.data?.description}&nbsp;&nbsp;
                    {isExpandDes && <span style={{ color: "#20a886", cursor: "pointer", opacity: "0.5"}} onClick={() => setIsExpanDes(!isExpandDes)}>{isExpandDes ? "less" : "more"}</span> }
                  </Typography>
                  {!isExpandDes && <span style={{ color: "#20a886", cursor: "pointer", opacity: "0.5"}} onClick={() => setIsExpanDes(!isExpandDes)}>{isExpandDes ? "less" : "more"}</span> }
                </Box>
              </>
            }
            <Box py={1}></Box>
            <Box display={"flex"} gap="30px" flexWrap={"wrap"}>
              {
                Object.keys(collectionDetail?.data?.auctionInfo).map((a, index) => (
                  <Box>
                    <Box key={index}>
                      <Typography className="titleSize" fontWeight={"bold"}>{formatEther(collectionDetail?.data?.auctionInfo[a]?.auctionVol?.toString())} USD</Typography>
                      <Typography fontSize="14px">{collectionDetail?.data?.auctionInfo[a].auctionCount} {getOnlyAuctionNameFromType(a)} auctions</Typography>
                    </Box>
                  </Box>
                ))
              }
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} gap={"4px"} alignItems={"center"} flexWrap={"nowrap"}>
          <a target="_blank" href={collectionDetail?.data?.project_url}><IconButton p={0} size="large"><RiGlobalLine className="titleSize"/></IconButton></a>
          <RefetchButton message="Refetched collection detail" refetchFunc={() => refetch()}/>
          <IconButton size="large" onClick={() => {
            debouncedResync();
            toast.success("Resync NFTs metadata", {
              duration: 2000
            });
          }}><SyncIcon className="titleSize"/></IconButton>
          <IconButton size="small" onClick={() => {
            copy(`${import.meta.env.VITE_FRONTEND_HOST}${location.pathname}`);
            toast.success("Copied");
          }} ><ShareIcon/></IconButton>
        </Box>
      </Box>
    </Box>
  )
});

export default CollectionHeader;