import { Box, Typography } from "@mui/material";
import React from "react";
import { useAppContext } from "src/context/useAppContext";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { formatAddress, formatID } from "src/utils";
import NFTAction from "./NFTAction";
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from "react-router-dom";
import CustomTooltip from "src/app/components/tooltip";

const AuctionActions = ({data}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{gridArea: "A"}} pt={5} px={5}>     
        <Box onClick={() => {
          navigate(`/collectiondetail/${data.token_address}`);
        }} sx={{
          cursor: "pointer",
          "&:hover *": {
            opacity: 0.8,
          }
        }}>
          <Box display={"flex"} gap="10px" alignItems={"center"}>
          <KeyboardBackspaceIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>
            <CustomTooltip text={data.token_address}>
              <Typography fontFamily={"Poppins"}>Collection {formatAddress(data.token_address)}</Typography>
            </CustomTooltip>
            {
              data.verified_collection == true && (
                <>
                  <VerifiedIcon fontSize="10px" sx={{color: "#4589FF"}}/>
                </>
              )
            }
          </Box>
        </Box>
        <Box pt={1}/>
        <CustomTooltip text={data.token_address}>
          <Typography
            className="fontSuperSize" fontWeight={"bold"} fontFamily={"Poppins"}
          >
            {formatAddress(data.token_address)}
          </Typography>
        </CustomTooltip>
        <Box pt={1}/>
        <Typography fontFamily={"Poppins"}>
          #{formatID(data.token_id)}
        </Typography>
        <Box pt={3}/>
        <Typography fontFamily={"Poppins"}>
          {data?.normalized_metadata?.description ?? "-"}
        </Typography>
        <Box pt={3}/>
      </Box>
      <Box sx={{gridArea: "C"}} pb={3} px={4} borderBottom={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
        <NFTAction data={data}/>
      </Box>
    </>
  )
}

export default AuctionActions;