import { Box, Checkbox, Typography } from "@mui/material";
import React, { useTransition } from "react";
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatAddress } from "src/utils";
import CustomTooltip from "../tooltip";

const CollectionListItem = ({data, setCurrentCollection, currentCollection}) => {
  const checked = currentCollection.some(c => c.address?.toLowerCase() == data.token_address?.toLowerCase());
  const [_, startTransition] = useTransition();
  return (
    <Box display="flex" alignItems={"center"} 
      onClick={() => {
        startTransition(() => {
          if(checked) {
            setCurrentCollection(currentCollection.filter((item)=> item.address?.toLowerCase() !== data.token_address.toLowerCase()));
          } else {
            setCurrentCollection([...currentCollection, {
              address: data.token_address.toLowerCase(),
              name: `${data?.name ? data?.name : formatAddress(data?.token_address)} ${!!data?.symbol ? `(${data?.symbol})` : ""}`
            }].sort());
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
          <img src={data?.collection_logo ?? data?.collection_banner_image ?? "https://storage.nfte.ai/asset/avatar/bg25.png?x-oss-process=image/resize,m_fill,w_300,h_300"} 
            width={"35px"} style={{borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover"}}
          />
          <Box>
            <CustomTooltip text={data?.token_address}>
              <Typography className="limitText fontSmallSize" sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Poppins",
                fontWeight: "bold"
              }}>{data?.name ? data?.name : formatAddress(data?.token_address, 3)} {!!data?.symbol ? `(${data?.symbol})` : null}</Typography>
            </CustomTooltip>
            <Box display={"flex"} gap="2px" alignItems={"center"}>
              <Typography fontSize={"10px"}>{data?.contract_type}</Typography>
              {
                data?.verified_collection == true &&
                <VerifiedIcon fontSize="10px" sx={{color: "#4589FF"}}/>
              }
            </Box>
          </Box>
        </Box>
        <Typography fontWeight={"bold"}>{data?.count ?? null}</Typography>
      </Box>
    </Box>
  )
}

export default CollectionListItem;