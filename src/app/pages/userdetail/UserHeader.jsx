import { Box, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import React, { memo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import RoundImage from "src/app/components/roundimage";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatAddress } from "src/utils";
import { RiGlobalLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { useAppContext } from "src/context/useAppContext";
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";
import clsx from "clsx";
import RefetchButton from "src/app/components/button/RefetchButton";
import useUserBasicInfo from "src/hooks/reactquery/useUserBasicInfo";
import EditIcon from '@mui/icons-material/Edit';
import { useAccount } from "wagmi";
import useCurrentNavigate from "src/hooks/useCurrentNavigate";
import toast from "react-hot-toast";
import { FailToLoad } from "src/app/components/error";
import CustomTooltip from "src/app/components/tooltip";
import ShareIcon from '@mui/icons-material/Share';

const UserHeader = memo(() => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  const [_, copy] = useCopyToClipboard();
  const [isExpandDes, setIsExpanDes] = useState(false);
  const account = useAccount();
  const location = useLocation();
  const navigate = useCurrentNavigate();

  let { userAddress } = useParams();
  const { data, isLoading, isError, refetch, error } = useUserBasicInfo({userAddress});

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
          <RoundImage url={`${import.meta.env.VITE_API_SERVER}/uploads/${data?.imageurl}`}/>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"baseline"}>
              <CustomTooltip text={userAddress}>
                <Typography sx={{
                  fontFamily: "Poppins", fontWeight: "bold",
                }} className="fontSuperSize limitText">
                  {data.username ? data.username : formatAddress(userAddress, 6)}
                </Typography>
              </CustomTooltip>
              &nbsp;
              {
                data.isKyced &&
                <VerifiedIcon className="titleSize" sx={{color: "#4589FF"}}/>
              }
            </Box>
            <Box display={"flex"} gap={"10px"} alignItems={"center"}>
              <Box display={"flex"} alignItems={"center"} gap="5px" border="1px solid gray" 
                borderRadius={"20px"} p="5px"
                backgroundColor={currentMode === "dark"? "#282a36" : "white"}
                sx={{
                  cursor: "pointer",
                  "& svg": {
                    color: currentMode === "dark"? "white" : "black",
                  },
                  "&:hover": {
                    backgroundColor: currentMode === "dark"? "white" : "#282a36",
                    color: currentMode === "dark"? "black" : "white",
                    "& p": {
                      color: currentMode === "dark"? "black" : "white",
                    },
                    "& svg": {
                      color: currentMode === "dark"? "black" : "white",
                    },
                  },
                }}
                onClick={() => {
                  copy(userAddress);
                  toast.success("Copied");
                }}
              >
                <CustomTooltip text={userAddress}>
                  <Typography fontSize={"12px"}>{formatAddress(userAddress)}</Typography>
                </CustomTooltip>
                <IoCopyOutline fontSize="small"/>
              </Box>
              <Typography><span style={{fontWeight: "bold"}}>{data.ownedNFTs}</span> NFTs</Typography>
              ·
              <Typography><span style={{fontWeight: "bold"}}>{data.ownedCollection}</span> collections</Typography>
            </Box>
            {
              <>
                <Box py={1}></Box>
                <Box display={"flex"} width={"80%"}>
                  <Typography className={clsx(!isExpandDes && "limitText")}>
                    {data.description ?? "The brief introduction has not been filled in yet"}&nbsp;&nbsp;
                    {isExpandDes && <span style={{ color: "#20a886", cursor: "pointer", opacity: "0.5"}} onClick={() => setIsExpanDes(!isExpandDes)}>{isExpandDes ? "less" : "more"}</span> }
                  </Typography>
                  {!isExpandDes && <span style={{ color: "#20a886", cursor: "pointer", opacity: "0.5"}} onClick={() => setIsExpanDes(!isExpandDes)}>{isExpandDes ? "less" : "more"}</span> }
                </Box>
              </>
            }
            
            <Box py={1}></Box>
            <Box display={"flex"} gap="30px" flexWrap={"wrap"}>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.biddedTime == 0 ? "-" : data.biddedTime}</Typography>
                <Typography fontSize="14px">Bidded auctions</Typography>
              </Box>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.ownedCollectionCount == 0 ? "-" : (data.ownedCollectionCount)}</Typography>
                <Typography fontSize="14px">Auctioned collections</Typography>
              </Box>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.biddedCollectionCount == 0 ? "-" : (data.biddedCollectionCount)}</Typography>
                <Typography fontSize="14px">Bidded collections</Typography>
              </Box>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.createdAuction == 0 ? "-" : data.createdAuction}</Typography>
                <Typography fontSize="14px">Auction created</Typography>
              </Box>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.biddedVolume == 0 ? "-" : (data.biddedVolume + "USD")}</Typography>
                <Typography fontSize="14px">Bidded volume</Typography>
              </Box>
              <Box>
                <Typography className="titleSize" fontWeight={"bold"}>{data.createdAuctionVolume == 0 ? "-" : (data.createdAuctionVolume + "USD")}</Typography>
                <Typography fontSize="14px">Auction volume</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} gap={"4px"} alignItems={"center"} flexWrap={"nowrap"}>
          {
            data.twitter && 
            <a target="_blank" href={`https://x.com/${data.twitter}`}><IconButton p={0}><FaXTwitter className="bigTextSize"/></IconButton></a>
          }
          {
            data.insta && 
            <a target="_blank" href={`https://www.instagram.com/${data.insta}`}><IconButton p={0}><FaInstagram className="bigTextSize"/></IconButton></a>
          }
          {
            data.tele && 
            <a target="_blank" href={`https://t.me/${data.tele}`}><IconButton p={0}><FaTelegramPlane className="bigTextSize"/></IconButton></a>
          }
          {
            data.discord && 
            <a target="_blank" href={`https://discord.gg/${data.discord}`}><IconButton p={0}><FaDiscord className="bigTextSize"/></IconButton></a>
          }
          <a target="_blank" href={data.website ?? import.meta.env.VITE_FRONTEND_HOST}><IconButton p={0}><RiGlobalLine className="bigTextSize"/></IconButton></a>
          <Box pl={0.4}/>
          <Box borderRight="1px solid" borderColor={theme.palette.primary.main} height="20px" width="1px"></Box>
          <Box pl={0.4}/>
          <RefetchButton message="Refetched user info" refetchFunc={() => refetch()} size="normal"/>
          {
            userAddress.toLowerCase() == account?.address?.toLowerCase() && 
            <IconButton onClick={() => navigate("/edituser")}><EditIcon className="bigTextSize"/></IconButton>
          }
          <IconButton size="small" onClick={() => {
            copy(`${import.meta.env.VITE_FRONTEND_HOST}${location.pathname}`);
            toast.success("Copied");
          }} ><ShareIcon/></IconButton>
        </Box>
      </Box>
    </Box>
  )
});

export default UserHeader;