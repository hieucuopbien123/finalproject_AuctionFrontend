import { Box, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import FilterButton from "src/app/components/button/FilterButton";
import GridButton from "src/app/components/button/GridButton";
import RefetchButton from "src/app/components/button/RefetchButton";
import FilterSelectButton from "src/app/components/button/FilterSelectButton";
import TextFieldFilter from "src/app/components/textfield";
import { useAppContext } from "src/context/useAppContext";
import AuctionTypeFilter from "src/app/components/filter/AuctionTypeFilter";
import { getAuctionNameFromType } from "src/utils";
import StatusFilter from "src/app/components/filter/StatusFilter";
import CreatorFilter from "src/app/components/filter/CreatorFilter";
import useAuctionCreators from "src/hooks/reactquery/useAuctionCreator";
import CollectionList from "./CollectionList";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const CollectionDetailAuction = () => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  const { address } = useParams();

  const [gridMode, setGridMode] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [auctionTypeFilter, setAuctionTypeFilter] = useState([]);
  const [status, setStatus] = useState(0); 
  const [currentCreator, setCurrentCreator] = useState([]);
  const queryClient = useQueryClient();

  return (
    <>
      <Box display={"flex"} flexWrap={"nowrap"}>
        <Box py={4} px={3} mr={1}
          sx={{borderRight: "1px solid", borderColor: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec", overscrollBehavior: "contain", width: "350px"}} 
          height="100vh" position="sticky" flexShrink={0} top="0"
          overflow={"scroll"} display={filterOpen ? "block" : "none"}
        >
          <StatusFilter setStatus={setStatus} status={status} />
          <AuctionTypeFilter {...{auctionTypeFilter, setAuctionTypeFilter}}/>
          <CreatorFilter {...{currentCreator, setCurrentCreator, useCreator: useAuctionCreators}}/>
        </Box>
        <Box p={3} flexShrink={10} flex={1}>
          <Box display={"flex"} gap="10px">
            <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
            <GridButton gridMode={gridMode} setGridMode={setGridMode} />
            <RefetchButton message="Refetched collection detail auctions" 
              refetchFunc={() => {
                queryClient.invalidateQueries({
                  predicate: 
                    (query) => query.queryKey?.[0] === 'auction' && query.queryKey?.[5]?.[0] == address,
                })
              }} 
              sx={{borderRadius: "8px", p: "6px", border: "2px solid #d0d1d4",
                "&:hover": { backgroundColor: currentMode == "dark" ? "white" : "black", "svg": { fill: currentMode == "dark" ? `${theme.palette.customDark} !important` : `${theme.palette.customLight} !important` } },                
                "svg": { fill: currentMode == "dark" ? `${theme.palette.customLight} !important` : `${theme.palette.customDark} !important` }
              }}
            />
            <Box width={"100%"}>
              <TextFieldFilter searchTerms={searchTerms} setSearchTerms={setSearchTerms} placeholderText="Search auctions"/>
            </Box>
          </Box>
          <Box py={1}/>
          {
            (auctionTypeFilter.length > 0) && (
              <>
                <Box display={"flex"} gap="10px" flexWrap={"wrap"}>
                  <Button variant="outlined" className="fontNomSize" sx={{
                    color: "#ff6838",
                    border: "2px solid #ff6838",
                    py: 0.5,
                    "&:hover": {
                      border: "2px solid #ff6838",
                    }
                  }} onClick={() => {
                    setAuctionTypeFilter([]);
                  }}>Clear</Button>
                  {
                    auctionTypeFilter.map((c) => (
                      <Box key={c}>
                        <FilterSelectButton text={`Type: ${getAuctionNameFromType(c)}`} 
                          handleClick={() => {
                            setAuctionTypeFilter(
                              auctionTypeFilter.filter(
                                (item) => item != c
                              )
                            );
                          }
                        }/>
                      </Box>
                    ))
                  }
                </Box>
                <Box py={1}/>
              </>
            )
          }
          <Box pt={0.5}/>
          <CollectionList {...{currentCreator, gridMode, searchTerms, auctionTypeFilter, status}}/>
        </Box>
      </Box>
    </>
  )
}

export default CollectionDetailAuction;