import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import clsx from "clsx";
import React, { useState } from "react"; 
import { formatAddress, formatID } from "src/utils";
import NFTCardPopup from "./NFTCardPopup";
import CreateAuctionDialog from "./CreateAuctionDialog";
import { getBackupNFTImage, getBackupNFTName, getImgSrc } from "../../utils";
import useImageOptimizer from "src/hooks/useImageOptimizer";
import ImageView from "../ImageView";
import CustomTooltip from "src/app/components/tooltip";

const NFTCard = ({data, gridMode, setBulkChosen, bulkChosen}) => {
  const checked = bulkChosen.some(c => 
    c.token_address?.toLowerCase() == data.token_address?.toLowerCase() &&
    c.token_id?.toLowerCase() == data.token_id?.toLowerCase()
  );
  const theme = useTheme();
  const [dialogIsOpen, openDialog] = useState(false);
  const [nftImage, setNFTImage] = useState(getImgSrc({data}));
  const resizedImageUrl = useImageOptimizer({ originalImage: nftImage, optimizedToWidth: 400 });

  const getBackupImage = async () => {
    if(nftImage.type == "bu" || nftImage.type == "collection"){
      setNFTImage({
        type: "nft",
        src: "https://cdn.x2y2.io/frontend/xZ/fHpX8VqL4JmdJf/280.png"
      });
    } else {
      setNFTImage(await getBackupNFTImage({data}));
    }
  }

  return (
    <Box sx={{borderRadius: "17px",border: "2px solid", borderColor: checked ? theme.palette.primary.main : "transparent", height: "100%"}}>
      <Paper sx={{borderRadius: "15px", overflow: "hidden", position: "relative",
        display: "flex", flexDirection: "column", height: "100%"
      }} className={checked ? "cardHover" : ""} elevation={3}>
        <Box onClick={() => {
        if(checked) {
          setBulkChosen(bulkChosen.filter((item) => !(
            item.token_address?.toLowerCase() == data.token_address?.toLowerCase() &&
            item.token_id?.toLowerCase() == data.token_id?.toLowerCase()
          )));
        } else {
          setBulkChosen([...bulkChosen, {
            ...data,
            resizedImageUrl
          }]);
        }
      }}>
          <ImageView nftImage={resizedImageUrl} getBackupImage={getBackupImage}/>
        </Box>
        <CustomTooltip text={(data.token_id?.length ?? 0) > 5 ? data.token_id : ""}>
          <Box position={"absolute"} top={5} right={5} px={1} py={0.5} sx={{
              fontFamily: "Poppins", fontWeight: "bolder", backgroundColor: theme.palette.primary.main, opacity: "0.9", borderRadius: "20px", color: "white"
            }} 
            className={clsx('fontSmallSize')}
          >
            #{formatID(data.token_id)}
          </Box>
        </CustomTooltip>
        <Box px={gridMode == 0 ? 2 : 1} py={gridMode == 0 ? 1 : 0.5} display={"flex"} flexDirection={"column"} flexGrow={1} justifyContent={"space-around"}>
          <CustomTooltip text={data?.token_address}>
            <Typography className={`fontSmallSize ${gridMode == 1 ? "limitText" : "limitText2"}`} sx={{
              color: theme.palette.primary.main
            }}>{`${data?.name ? data?.name : formatAddress(data?.token_address)} ${!!data?.symbol ? `(${data?.symbol})` : ""}`}</Typography>
          </CustomTooltip>
          <Typography fontWeight="bold" className={gridMode == 1 ? "limitText" : "limitText2"}>{data?.normalized_metadata?.name ?? getBackupNFTName({data})}</Typography>
          <Box pt={1}></Box>
          <Divider/>
          <Box minHeight={"37px"}>
            <div>
              <Box justifyContent={"space-between"} alignItems="center" pt={0.5}
                display="flex" 
              >
                <Typography className="fontSmallSize">
                  {data.amount > 1 && `Amount: ${data.amount}`} &nbsp;
                </Typography>
                <NFTCardPopup data={data} openDialog={openDialog} checked={checked} setBulkChosen={setBulkChosen}/>
              </Box>
            </div>
          </Box>
        </Box>
      </Paper>
      <CreateAuctionDialog {...{dialogIsOpen, openDialog, data, nftImage: resizedImageUrl}}/>
    </Box>
  )
}

export default NFTCard;