import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterButton from "src/app/components/button/FilterButton";
import GridButton from "src/app/components/button/GridButton";
import CollectionList from "./CollectionList";
import RefetchButton from "src/app/components/button/RefetchButton";
import { useParams } from "react-router-dom";
import FilterSelectButton from "src/app/components/button/FilterSelectButton";
import TextFieldFilter from "src/app/components/textfield";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "src/context/useAppContext";
import ButtonCreateMultiNFTsAuction from './ButtonCreateMultiNFTsAuction';
import { useAccount } from 'wagmi';
import CollectionFilter from 'src/app/components/filter/CollectionFilter';
import useUserCollections from 'src/hooks/reactquery/useUserCollections';

const UserCollected = () => {
  const { userAddress } = useParams();
  const { colorMode: { currentMode } } = useAppContext();
  const theme = useTheme();
  const account = useAccount(); 

  const [gridMode, setGridMode] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState([]);
  useEffect(() => {
    if(userAddress) setCurrentCollection([]);
  }, [userAddress]);
  useEffect(() => {
    setBulkChosen([]);
  }, [account.address]);
  const [searchTerms, setSearchTerms] = useState("");
  const queryClient = useQueryClient();
  const [bulkChosen, setBulkChosen] = useState([]);

  return (
    <>
      <Box display={"flex"} flexWrap={"nowrap"}>
        <Box py={4} px={3} mr={1}
          sx={{borderRight: "1px solid", borderColor: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec", overscrollBehavior: "contain", width: "350px"}} 
          height="100vh" pb={"60px"} position="sticky" flexShrink={0} top="0"
          overflow={"scroll"} display={filterOpen ? "block" : "none"}
        >
          <CollectionFilter 
            {...{currentCollection, setCurrentCollection, useCollection: useUserCollections}}
          />
        </Box>
        <Box p={3} flexShrink={10} flex={1} pb={"60px"}>
          <Box display={"flex"} gap="10px" alignItems={"flex-end"} flexWrap="wrap">
            <Box display={"flex"} gap="10px" flexGrow={1} flexWrap={"wrap"}>
              <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
              <GridButton gridMode={gridMode} setGridMode={setGridMode} />
              <RefetchButton message="Refetched user nfts"
                refetchFunc={() => {
                  queryClient.invalidateQueries({ queryKey: ["userNFTs", userAddress] });
                }}
                sx={{borderRadius: "8px", p: "6px", border: "2px solid #d0d1d4",
                  "&:hover": { backgroundColor: currentMode == "dark" ? "white" : "black", "svg": { fill: currentMode == "dark" ? `${theme.palette.customDark} !important` : `${theme.palette.customLight} !important` } },
                  "svg": { fill: currentMode == "dark" ? `${theme.palette.customLight} !important` : `${theme.palette.customDark} !important` }
                }}
              />
              <TextFieldFilter searchTerms={searchTerms} setSearchTerms={setSearchTerms} placeholderText="Search NFTs"/>
              {
                userAddress.toLowerCase() == account?.address?.toLowerCase() &&
                <ButtonCreateMultiNFTsAuction {...{bulkChosen, account, setBulkChosen}}/>
              }
            </Box>
            <Box minWidth={"100px"} display="flex" alignItems={"center"}>
              {
                bulkChosen.length > 0 &&
                <>
                  <Typography style={{fontStyle: "italic", opacity: 0.8}}>{bulkChosen.length} selected</Typography>
                  <IconButton disableRipple>
                    <CloseIcon fontSize='small' onClick={() => setBulkChosen([])}/>
                  </IconButton>
                </>
              }
            </Box>
          </Box>
          <Box py={1}/>
          {
            currentCollection.length > 0 && (
              <>
                <Box display={"flex"} gap="10px" flexWrap={"wrap"}>
                  <Button variant="outlined" className="fontNomSize" sx={{
                    color: "#ff6838",
                    border: "2px solid #ff6838",
                    py: 0.5,
                    "&:hover": {
                      border: "2px solid #ff6838",
                    }
                  }} onClick={() => setCurrentCollection([])}>Clear</Button>
                  {
                    currentCollection.map(c => (
                      <Box key={c.address}>
                        <FilterSelectButton text={c.name} handleClick={() => {
                          setCurrentCollection(currentCollection.filter((item) => item.address.toLowerCase() !== c.address.toLowerCase()));
                        }}/>
                      </Box>
                    ))
                  }
                </Box>
                <Box py={1}/>
              </>
            )
          }
          <Box pt={0.5}/>
          <CollectionList {...{bulkChosen, 
            setBulkChosen: userAddress.toLowerCase() == account?.address?.toLowerCase() 
              ? setBulkChosen
              : () => {}, 
            collectionAddress: currentCollection, gridMode, searchTerms
          }}/>
        </Box>
      </Box>
    </>
  )
}

export default UserCollected;