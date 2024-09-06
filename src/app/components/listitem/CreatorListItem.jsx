import { Box, Checkbox, Typography } from "@mui/material";
import React, { useTransition } from "react";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatAddress } from "src/utils";
import CustomTooltip from "../tooltip";

const CreatorListItem = ({data, setCurrentCreator, currentCreator}) => {
  const checked = currentCreator.some(c => c?.address?.toLowerCase() == data?.address?.toLowerCase());
  const [_, startTransition] = useTransition();
  return (
    <Box display="flex" alignItems={"center"} 
      onClick={() => {
        startTransition(() => {
          if(checked) {
            setCurrentCreator(currentCreator.filter((item)=> item?.address?.toLowerCase() !== data?.address?.toLowerCase()));
          } else {
            setCurrentCreator([...currentCreator, data].sort());
          }
        })
      }}
      sx={{
        "&:hover": {
          opacity: 0.8,
          cursor: "pointer"
        }
    }}>
      <Checkbox sx={{transform: "translateX(-10px)", opacity: 0.8}} disableRipple checked={checked}/>
      <Box display="flex" justifyContent={"space-between"} flexGrow={1} alignItems={"center"} gap="10px">
        <Box display={"flex"} alignItems={"center"} gap="10px" sx={{transform: "translateX(-10px)"}}>
          <img src={data?.imageurl ? `${import.meta.env.VITE_API_SERVER}/uploads/${data?.imageurl}` : "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"} 
            width={"35px"} style={{borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover"}}
          />
          <Box>
            <CustomTooltip text={data.address}>
              <Typography className="limitText fontSmallSize" sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Poppins",
                fontWeight: "bold"
              }}>{data?.username ?? formatAddress(data.address)}</Typography>
              <Box display={"flex"} gap="2px" alignItems={"center"}>
                <Typography fontSize={"10px"}>{data?.username ? formatAddress(data.address) : ""}</Typography>
                {
                  data?.isKyced == true &&
                  <VerifiedIcon fontSize="10px" sx={{color: "#4589FF"}}/>
                }
              </Box>
            </CustomTooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreatorListItem;