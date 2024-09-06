import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import GridButton from "src/app/components/button/GridButton";
import CollectionList from "./CollectionList";
import RefetchButton from "src/app/components/button/RefetchButton";
import TextFieldFilter from "src/app/components/textfield";
import { useAppContext } from "src/context/useAppContext";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CollectionDetailNFT = () => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  const { address } = useParams();

  const [gridMode, setGridMode] = useState(0);
  const [searchTerms, setSearchTerms] = useState("");
  const queryClient = useQueryClient();

  return (
    <>
      <Box display={"flex"} flexWrap={"nowrap"}>
        <Box p={3} flexShrink={10} flex={1} pb={"60px"}>
          <Box display={"flex"} gap="10px" alignItems={"center"}>
            <Box display={"flex"} gap="10px" flexGrow={1}>
              <GridButton gridMode={gridMode} setGridMode={setGridMode} />
              <RefetchButton message="Refetched collection details"
                refetchFunc={() => {
                  queryClient.invalidateQueries({ queryKey: ["collectionNFTs", address] });
                }}
                sx={{borderRadius: "8px", p: "6px", border: "2px solid #d0d1d4",
                  "&:hover": { backgroundColor: currentMode == "dark" ? "white" : "black", "svg": { fill: currentMode == "dark" ? `${theme.palette.customDark} !important` : `${theme.palette.customLight} !important` } },
                  "svg": { fill: currentMode == "dark" ? `${theme.palette.customLight} !important` : `${theme.palette.customDark} !important` }
                }}
              />
              <Box width={"100%"} display={"flex"} gap={"10px"}>
                <TextFieldFilter searchTerms={searchTerms} setSearchTerms={setSearchTerms} placeholderText="Search NFTs"/>
              </Box>
            </Box>
          </Box>
          <Box py={1}/>
          <CollectionList {...{gridMode, searchTerms}}/>
        </Box>
      </Box>
    </>
  )
}

export default CollectionDetailNFT;