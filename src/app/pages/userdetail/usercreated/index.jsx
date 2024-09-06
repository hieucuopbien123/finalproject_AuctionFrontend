import { Box, Button, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterButton from "src/app/components/button/FilterButton";
import GridButton from "src/app/components/button/GridButton";
import RefetchButton from "src/app/components/button/RefetchButton";
import { useParams } from "react-router-dom";
import FilterSelectButton from "src/app/components/button/FilterSelectButton";
import TextFieldFilter from "src/app/components/textfield";
import CollectionList from "./CollectionList";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "src/context/useAppContext";
import CollectionFilter from "src/app/components/filter/CollectionFilter";
import useUserOwnedAuctionCollection from "src/hooks/reactquery/useUserOwnedAuctionCollection";
import AuctionTypeFilter from "src/app/components/filter/AuctionTypeFilter";
import { getAuctionNameFromType } from "src/utils";
import StatusFilter from "src/app/components/filter/StatusFilter";
import { useAccount } from "wagmi";

const UserCreated = () => {
  const account = useAccount();
  const { userAddress } = useParams();
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();

  const [gridMode, setGridMode] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState([]);
  useEffect(() => {
    if(userAddress) setCurrentCollection([]);
  }, [userAddress]);
  const [searchTerms, setSearchTerms] = useState("");
  const queryClient = useQueryClient();
  const [auctionTypeFilter, setAuctionTypeFilter] = useState([]);
  const [status, setStatus] = useState(0); 

  return (
    <>
      <Box display={"flex"} flexWrap={"nowrap"}>
        <Box py={4} px={3} mr={1}
          sx={{borderRight: "1px solid", borderColor: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec", overscrollBehavior: "contain", width: "350px"}} 
          height="100vh" pb={"60px"} position="sticky" flexShrink={0} top="0"
          overflow={"scroll"} display={filterOpen ? "block" : "none"}
        >
          <StatusFilter setStatus={setStatus} status={status} />
          <AuctionTypeFilter {...{auctionTypeFilter, setAuctionTypeFilter}}/>
          <CollectionFilter 
            {...{currentCollection, setCurrentCollection, useCollection: useUserOwnedAuctionCollection}}
          />
        </Box>
        <Box p={3} flexShrink={10} flex={1} pb={"60px"}>
          <Box display={"flex"} gap="10px">
            <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
            <GridButton gridMode={gridMode} setGridMode={setGridMode} />
            <RefetchButton message="Refetched auctions user created" 
              refetchFunc={() => {
                queryClient.invalidateQueries({
                  predicate: 
                    (query) => query.queryKey?.[0] === 'auction' && query.queryKey?.[2]?.[0] == userAddress,
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
            (currentCollection.length > 0 || auctionTypeFilter.length > 0) && (
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
                    setAuctionTypeFilter([]);
                  }}>Clear</Button>
                  {
                    currentCollection.map((c) => (
                      <Box key={c.address}>
                        <FilterSelectButton text={c.name} handleClick={() => {
                          setCurrentCollection(currentCollection.filter((item) => item.address.toLowerCase() !== c.address.toLowerCase()));
                        }}/>
                      </Box>
                    ))
                  }
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
          <CollectionList {...{collectionAddress: currentCollection, gridMode, searchTerms, account, auctionTypeFilter, status}}/>
        </Box>
      </Box>
    </>
  )
}

export default UserCreated;