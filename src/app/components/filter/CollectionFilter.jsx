import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { FaRegImage } from "react-icons/fa6";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CollectionListItem from "src/app/components/listitem/CollectionListItem";
import { useInView } from "react-intersection-observer";
import SkeletonCollectionList from "src/app/components/skeletoncards/SkeletonCollectionList";
import { FailToLoad } from "src/app/components/error";
import { Empty } from "../empty";
import { useAppContext } from "src/context/useAppContext";

const CollectionFilter = ({currentCollection, setCurrentCollection, useCollection}) => {
  const { 
    data: userCollection, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, isError, error 
  } = useCollection();
  const [filterCollectionsOpen, setFilterCollectionOpen] = useState(true);
  const [filterCollection, setFilterCollection] = useState("");
  const { colorMode: { currentMode } } = useAppContext();
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    startTransition(() => {
      if(filterCollection == "") {
        setFilteredData(userCollection?.pages?.map(p => (p?.data)) ?? []);
      } else {
        setFilteredData(userCollection?.pages?.map(p => (
          p?.data?.filter(d => 
            d?.name?.toLowerCase()?.includes(filterCollection.toLowerCase()) ||
            d?.token_address?.toLowerCase()?.includes(filterCollection.toLowerCase())
          )
        )));
      }
    });
  }, [userCollection, filterCollection]);
  const [isPending, startTransition] = useTransition();
  const { ref, inView } = useInView();
  const [isAutoFetching, setAutoFetching] = useState(false);
  useEffect(() => {
    let timerId;
    if (inView && isAutoFetching == false) {    
      setAutoFetching(true);
      fetchNextPage();
    } else if(isAutoFetching == true) {
      timerId = setTimeout(() => {
        setAutoFetching(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timerId);
    }
  }, [inView, fetchNextPage, isAutoFetching]);

  const CollectionListComp = useMemo(() => () => {
    if(isError) {
      return <FailToLoad size="3rem" className="fontSmallSize" title={`Error: ${error.message}`}/>
    }
    if(isLoading || isPending) {
      return <SkeletonCollectionList pageSize={3}/>
    }
    return (
      <>
        {
          filteredData.map((page, i) => {
            return page.map((data, index) => (
              <Box key={data.token_address}>
                <Box>
                  <CollectionListItem data={data} currentCollection={currentCollection} setCurrentCollection={setCurrentCollection}/>
                </Box>
                <Box py={1}></Box>
              </Box>
            ))
          })
        }
        {
          ((filteredData.length <= 0 || !filteredData?.[0]?.[0]) && !hasNextPage) && (
            <Box pt={0.5}>
              <Empty title={"There is no collections!"}/>
            </Box>
          )
        }
        {
          hasNextPage && (
            <>
              {
                (isFetchingNextPage || isAutoFetching) ? (
                  <SkeletonCollectionList/>
                ) : ( 
                  <>
                    {
                      filterCollection ?
                      <div ref={ref}></div> :
                      <Box textAlign={"center"} pt={1}>
                        <Button className="fontNomSize" variant="outlined" fullWidth disableRipple 
                          sx={{borderWidth: "3px", fontWeight: "bold", "&:hover": { borderWidth: "3px"}}}
                          onClick={() => fetchNextPage()}
                        >Load more...</Button>
                      </Box>
                    }
                  </>
                )
              }
            </>
          )
        }
      </>
    );
  }, [currentCollection, hasNextPage, isFetchingNextPage, setCurrentCollection, ref, filteredData, error, isError, isLoading, isPending, fetchNextPage, filterCollection, isAutoFetching]);

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}
        sx={{cursor: "pointer", "&:hover": { opacity: 0.7 }}}
        onClick={() => setFilterCollectionOpen(!filterCollectionsOpen)}
      >
        <Box display="flex" alignItems="center" gap="10px">
          <FaRegImage fontSize="large" color={currentMode == "dark" ? "#f8f8f3" : "black"}/>
          <Typography fontWeight="500">COLLECTIONS</Typography>
        </Box>
        {filterCollectionsOpen ? 
        <KeyboardArrowUpIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/> : 
        <KeyboardArrowDownIcon sx={{color: currentMode == "dark" ? "#f8f8f3" : "black"}}/>}
      </Box>
      <Box py={1}></Box>
      {
        filterCollectionsOpen && 
        <>
          <TextField placeholder="Filter"
            fullWidth
            value={filterCollection}
            onChange={(event) => {
              setFilterCollection(event.target.value);
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchSharpIcon/></InputAdornment>,
            }}
            sx={{
              input: { 
                fontWeight: "bold", 
                fontSize: "large" 
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "10px",
              },
              "& .MuiOutlinedInput-root": {
                height: "50px",
              }
            }}
          />
          <Box py={1}></Box>
          <CollectionListComp/>
          <Box py={1}></Box>
        </>
      }
    </>
  )
}

export default CollectionFilter;