import { Box, Typography } from "@mui/material";
import React from "react"; 
import { useAppContext } from "src/context/useAppContext";

const ImageView = ({nftImage, getBackupImage, onClick, ...props}) => {
  const { colorMode: { currentMode } } = useAppContext();

  if(!nftImage?.src) {
    return <img width="100%"
        src={"/default.png"}
        style={{
          objectFit: 'cover',
          aspectRatio: "1/1",
        }}
      />
    ;
  }

  return (
    <>
      <Box width={"100%"} sx={{aspectRatio: "1/1", cursor: "pointer"}} {...props} onClick={onClick}>
        {
          (nftImage.type == "collection") ? (
            <Box display={"flex"} flexDirection="column" alignItems={"center"} height="100%" justifyContent={"center"}>
              <img width="40%"
                className={currentMode == "dark" ? "glowLight" : "glowDark"}
                src={nftImage.src}
                style={{
                  objectFit: 'cover',
                  aspectRatio: "1/1",
                  borderRadius: "50%"
                }}
                loading="lazy"
                onError={() => {
                  if(getBackupImage) getBackupImage()
                }}
              />
              <Typography pt={1} className="fontSmallSize" fontFamily={"Poppins"}>Content not available</Typography>
            </Box>
          ) : (
            <img width="100%"
              src={nftImage.src}
              style={{
                objectFit: 'cover',
                aspectRatio: "1/1",
              }}
              loading="lazy"
              onError={() => {
                if(getBackupImage) getBackupImage()
              }}
            />
          )
        }
      </Box>
    </>
  )
}

export default ImageView;