import React, { useState } from "react";
import useAuctionCollections from "src/hooks/reactquery/useAuctionCollections";
import RefetchButton from "src/app/components/button/RefetchButton";
import { Box, Button, useTheme } from "@mui/material";
import FilterButton from "src/app/components/button/FilterButton";
import GridButton from "src/app/components/button/GridButton";
import FilterSelectButton from "src/app/components/button/FilterSelectButton";
import { useParams } from "react-router-dom";
import TextFieldFilter from "src/app/components/textfield";
import AuctionList from "./AuctionList";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "src/context/useAppContext";
import CollectionFilter from "src/app/components/filter/CollectionFilter";
import CreatorFilter from "src/app/components/filter/CreatorFilter";
import useAuctionCreators from "src/hooks/reactquery/useAuctionCreator";

const AuctionTypeDetail = ({account}) => {
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  const [gridMode, setGridMode] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState([]);
  const [currentCreator, setCurrentCreator] = useState([]);
  const [searchTerms, setSearchTerms] = useState("");
  const queryClient = useQueryClient();
  const { auctionType } = useParams();

  return (
    <>
      <Box display={"flex"} flexWrap={"nowrap"} borderTop={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
        <Box py={4} px={3} mr={1}
          sx={{borderRight: "1px solid", borderColor: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec", overscrollBehavior: "contain", width: "350px"}} 
          height="100vh" position="sticky" flexShrink={0} top="0"
          overflow={"scroll"} display={filterOpen ? "block" : "none"}
        >
          <CreatorFilter {...{currentCreator, setCurrentCreator, useCreator: useAuctionCreators}}/>
          <CollectionFilter
            {...{currentCollection, setCurrentCollection, useCollection: useAuctionCollections}}
          />
        </Box>
        <Box p={3} flexShrink={10} flex={1}>
          <Box display={"flex"} gap="10px" flexWrap="wrap">
            <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
            <GridButton gridMode={gridMode} setGridMode={setGridMode} />
            <RefetchButton message="Refetched auctions"
              refetchFunc={() => {
                queryClient.invalidateQueries({ queryKey: ["auction", [parseInt(auctionType)]] });
                queryClient.invalidateQueries({ queryKey: ["auctionStats", parseInt(auctionType)] });
              }}
              sx={{borderRadius: "8px", p: "6px", border: "2px solid #d0d1d4",
                "&:hover": { backgroundColor: currentMode == "dark" ? "white" : "black", "svg": { fill: currentMode == "dark" ? `${theme.palette.customDark} !important` : `${theme.palette.customLight} !important` } },
                "svg": { fill: currentMode == "dark" ? `${theme.palette.customLight} !important` : `${theme.palette.customDark} !important` }
              }}
            />
            <Box flexGrow={1}>
              <TextFieldFilter searchTerms={searchTerms} setSearchTerms={setSearchTerms} placeholderText="Search Auctions"/>
            </Box>
          </Box>
          <Box py={1}/>
          {
            (currentCollection.length > 0 || currentCreator.length > 0)&& (
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
                    setCurrentCollection([]);
                    setCurrentCreator([]);
                  }}>Clear</Button>
                  {
                    currentCollection.map((c) => (
                      <Box key={c.address}>
                        <FilterSelectButton text={`Coll: ${c.name}`} handleClick={() => {
                          setCurrentCollection(currentCollection.filter((item) => item.address.toLowerCase() !== c.address.toLowerCase()));
                        }}/>
                      </Box>
                    ))
                  }
                  {
                    currentCreator.map((c) => (
                      <Box key={c.address}>
                        <FilterSelectButton text={`Crea: ${c.username ?? c.address}`} handleClick={() => {
                          setCurrentCreator(currentCreator.filter((item) => item.address.toLowerCase() !== c.address.toLowerCase()));
                        }}/>
                      </Box>
                    ))
                  }
                </Box>
                <Box py={1}/>
              </>
            )
          }
          <AuctionList collectionAddress={currentCollection} gridMode={gridMode} currentCreator={currentCreator} searchTerms={searchTerms} account={account}/>
        </Box>
      </Box>
    </>
  )
}

export default AuctionTypeDetail;