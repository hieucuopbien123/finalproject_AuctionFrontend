import React from "react";
import useSearch from "src/hooks/reactquery/useSearch";
import { useDebounce } from "@uidotdev/usehooks";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { Empty } from "../empty";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatAddress, getAuctionShortNameFromType } from "src/utils";
import { useAppContext } from "src/context/useAppContext";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../tooltip";

const GlobalSearch = ({searchTerms, open, setOpen}) => {
  const debouncedSearchTerms = useDebounce(searchTerms, 500);
  const { data, isLoading } = useSearch({searchTerms: debouncedSearchTerms});
  const theme = useTheme();
  const { colorMode: { currentMode } } = useAppContext();
  const navigate = useNavigate();
  return (
    <>
      {
        open &&
        <Paper sx={{position: "absolute", px: 1, pb: 2, width: "100%", zIndex: 1000, mt: 2, minWidth: "285px", maxWidth: "500px" }} 
          className="animate__animated animate__fadeIn" elevation={3}
        >
          {
            isLoading ?
            <Box style={{display: "flex", justifyContent: "center", alignItems: "center"}} py={4}>
              <div className="smallloading"></div>
            </Box> : 
            <>
              <Typography fontFamily={"Poppins"} fontWeight="bold" className="fontSmallSize" px={1} pt={2}>Users</Typography>
              {
                (data?.data?.user?.length ?? 0) == 0 ? 
                <Box>
                  <Empty size="3rem" title={"No user founded!"} className="fontSmallSize"/>
                </Box> : 
                <Box>
                  <Box py={1}/>
                  <Box display={"flex"} flexDirection={"column"} gap="5px">
                    {
                      data?.data?.user?.map(n => (
                        <Box key={n.id ?? n._id} px={1.5} py={0.5} borderRadius="5px" 
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: theme.palette.customBg
                            }
                          }} onClick={() => {
                            if(n.id && n.id != "0x0000000000000000000000000000000000000000")
                              navigate(`/userdetail/${n.id}`);
                            setOpen(false);
                          }}
                        >
                          <Box display="flex" gap="15px" alignItems="center">
                            <img src={n?.imageurl ? `${import.meta.env.VITE_API_SERVER}/uploads/${n?.imageurl}` : "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"}
                              width={"40px"} height="40px" style={{borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover"}}
                            />
                            <Box>
                              <Box display="flex" alignItems="center" gap="5px">
                                <CustomTooltip text={n._id}>
                                  <Typography fontFamily="Poppins" fontWeight="bold" className="fontSmallSize">{n?.username ?? formatAddress(n.id) ?? formatAddress(n._id)}</Typography>
                                </CustomTooltip>
                                {
                                  n?.isKyced == true &&
                                  <VerifiedIcon fontSize="5px" sx={{color: "#4589FF"}}/>
                                }
                              </Box>
                              {
                                n?._id && n.ownedCollectionCount == null ?
                                <></> :
                                <Box display="flex" gap="10px">
                                  <Typography className="fontSmallSize">{n.ownedCollectionCount ?? 0} collections</Typography>
                                  <Box borderRight="1px solid" borderColor="#777e90" sx={{opacity: 0.5}}/>
                                  <Typography className="fontSmallSize">{n.biddedCollectionCount ?? 0} auctions</Typography>
                                </Box>
                              }
                            </Box>
                          </Box>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              }
              <Typography fontFamily={"Poppins"} fontWeight="bold" className="fontSmallSize" px={1} pt={2}>Auctions</Typography>
              {
                (data?.data?.auction?.length ?? 0) == 0 ? 
                <Box>
                  <Empty size="3rem" title={"No auction founded!"} className="fontSmallSize"/>
                </Box> : 
                <Box>
                  <Box py={1}/>
                  <Box display={"flex"} flexDirection={"column"} gap="5px">
                    {
                      data?.data?.auction?.map(n => (
                        <Box key={n.id ?? n._id} px={1.5} py={0.5} borderRadius="5px" sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: theme.palette.customBg
                          }
                          }} onClick={() => {
                          if(n.id && n.id != "0x0000000000000000000000000000000000000000")
                            navigate(`/auctiondetail/${n.id}`);
                          setOpen(false);
                        }}>
                          <Box display="flex" gap="20px" alignItems="center">
                            <Box sx={{borderRadius: "50px", backgroundColor: theme.palette.customBg, height: "46px", width: "46px"}}
                              display={"flex"} alignItems={"center"} justifyContent={"center"} border="1px solid #777e90"
                            >
                              <Typography fontWeight={"bold"} fontFamily={"Poppins"} className="bigTextSize">{getAuctionShortNameFromType(n.auctionType)}</Typography>
                            </Box>
                            <Box>
                              <Box display="flex" alignItems="center" gap="5px">
                                <CustomTooltip text={n.id}>
                                  <Typography fontFamily="Poppins" fontWeight="bold" className="fontSmallSize">{formatAddress(n.id, 10)}</Typography>
                                </CustomTooltip>
                              </Box>
                              <Box display="flex" gap="8px" alignItems="center" pt={0.2}>
                                {
                                  n.status == 0 ?
                                  <Box px={0.5} 
                                    sx={{
                                      fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: "#21d055db", 
                                      borderRadius: "20px", color: "white", fontSize: "11px"
                                    }}
                                  >
                                    Exist
                                  </Box> : 
                                  <Box px={0.5}
                                    sx={{
                                      fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: currentMode == "dark" ? "white" : "#000000ba", fontSize: "11px",
                                      borderRadius: "20px", color: currentMode == "dark" ? "black" : "white"
                                    }} 
                                  >
                                    Deleted
                                  </Box>
                                }
                                <Box borderRight="1px solid" borderColor="#777e90" sx={{opacity: 0.5, width: "1px", height: "20px"}}/>
                                <Typography sx={{fontSize: "11px"}}>{(new Date(n.timestamp*1000)).toLocaleString()}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              }
              <Typography fontFamily={"Poppins"} fontWeight="bold" className="fontSmallSize" px={1} pt={2}>Collections</Typography>
              {
                (data?.data?.collection?.length ?? 0) == 0 ? 
                <Box>
                  <Empty size="3rem" title={"No user founded!"} className="fontSmallSize"/>
                </Box> : 
                <Box>
                  <Box py={1}/>
                  <Box display={"flex"} flexDirection={"column"} gap="5px">
                    {
                      data?.data?.collection?.map(n => (
                        <Box key={n.id ?? n._id} px={1.5} py={0.5} borderRadius="5px" sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: theme.palette.customBg
                          }
                          }} onClick={() => {
                          if(n.token_address && n.token_address != "0x0000000000000000000000000000000000000000")
                            navigate(`/collectiondetail/${n.token_address}`);
                          setOpen(false);
                        }}>
                          <Box display="flex" gap="15px" alignItems="center">
                            <img src={(n?.collection_logo || n?.collection_banner_image) ? (n?.collection_logo || n?.collection_banner_image) : "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"}
                              width={"40px"} height="40px" style={{borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover"}}
                            />
                            <Box>
                              <Box display="flex" alignItems="center" gap="5px">
                                <CustomTooltip text={n.token_address}>
                                  <Typography fontFamily="Poppins" fontWeight="bold" className="fontSmallSize">
                                    {formatAddress(n.token_address, 6)}
                                  </Typography>
                                </CustomTooltip>
                                {
                                  n?.verified_collection == true &&
                                  <VerifiedIcon fontSize="5px" sx={{color: "#4589FF"}}/>
                                }
                              </Box>
                              <Box display="flex" gap="10px">
                                <Typography className="fontSmallSize">{
                                  n.name && n.symbol ? 
                                  (`${n.name} (${n.symbol})`) :
                                  (n.name ? 
                                  (n.name) : 
                                  (n.symbol ? 
                                  (n.symbol) : 
                                  ("-")))
                                }</Typography>
                                <Box borderRight="1px solid" borderColor="#777e90" sx={{opacity: 0.5}}/>
                                <Typography className="fontSmallSize">{n.contract_type}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              }
            </>
          }
        </Paper>
      }
    </>
  )
}

export default GlobalSearch;