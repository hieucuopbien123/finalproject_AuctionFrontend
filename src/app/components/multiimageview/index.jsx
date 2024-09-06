import { Box, Zoom } from "@mui/material";
import React from "react";
import { formatAddress, formatID } from "src/utils";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import OneImage from "./OneImage";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000000cc"
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000000cc"
  }
}));

const ToolTipMultiImage = ({nftInfo}) => {
  return (
    <div style={{fontFamily: "Poppins", opacity: "0.94", fontSize: "12px"}}>
      {
        nftInfo.map((n, index) => (
          <div key={index}>
            <div className="limitText2" style={{fontWeight: "bold"}}>{n.name} {`${!!n?.symbol ? `(${n?.symbol}) - ` : ""}`} {`${n.contractType}`}</div>
            <div>Address: {formatAddress(n.tokenAddress, 6)}</div>
            <div className="limitText">Id: #{formatID(n.tokenId)}</div>
            <div className="limitText">Amount: {n?.nftCount ?? 1}</div>
            <br/>
          </div>
        ))
      }
    </div>
  )
}

const MultiImageView = ({ urls, nftInfo }) => {
  return (
    <BootstrapTooltip title={<ToolTipMultiImage nftInfo={nftInfo}/>} arrow disableInteractive TransitionComponent={Zoom} 
      {...(nftInfo.length > 3 ? { placement: "right" } : {})}
    >
      <Box style={{ aspectRatio: "1/1", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#777e90"}}>
        {
          urls.length == 1 && (
            <OneImage src={urls[0]}/>
          )
        }
        {
          urls.length == 2 && (
            <>
              <OneImage src={urls[0]} height="50%"/>
              <Box style={{height: "2px"}}></Box>
              <OneImage src={urls[1]} height="50%"/>
            </>
          )
        }
        {
          urls.length == 3 && (
            <>
              <OneImage src={urls[0]} height="50%"/>
              <Box style={{height: "2px"}}></Box>
              <Box style={{display: "flex", height: "50%", gap: "2px"}}>
                <OneImage src={urls[1]} width="50%"/>
                <OneImage src={urls[2]} width="50%"/>
              </Box>
            </>
          )
        }
        {
          urls.length == 4 && (
            <>
              <Box style={{display: "flex", height: "50%", gap: "2px"}}>
                <OneImage src={urls[0]} width="50%"/>
                <OneImage src={urls[1]} width="50%"/>
              </Box>
              <Box style={{height: "2px"}}></Box>
              <Box style={{display: "flex", height: "50%", gap: "2px"}}>
                <OneImage src={urls[2]} width="50%"/>
                <OneImage src={urls[3]} width="50%"/>
              </Box>
            </>
          )
        }
        {
          urls.length >= 5 && (
            <>
              <Box style={{display: "flex", height: "50%", gap: "2px"}}>
                <OneImage src={urls[0]} width="50%"/>
                <OneImage src={urls[1]} width="50%"/>
              </Box>
              <Box style={{height: "2px"}}></Box>
              <Box style={{display: "flex", height: "50%", gap: "2px"}}>
                <OneImage src={urls[2]} width="33%"/>
                <OneImage src={urls[3]} width="33%"/>
                <OneImage src={urls[4]} width="33%"/>
              </Box>
            </>
          )
        }
      </Box>
    </BootstrapTooltip>
  )
}

export default MultiImageView;