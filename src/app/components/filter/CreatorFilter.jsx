import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { FaUserAlt } from "react-icons/fa";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CollectionListItem from "src/app/components/listitem/CollectionListItem";
import { useInView } from "react-intersection-observer";
import SkeletonCollectionList from "src/app/components/skeletoncards/SkeletonCollectionList";
import { FailToLoad } from "src/app/components/error";
import useAuctionCreators from "src/hooks/reactquery/useAuctionCreator";
import CreatorListItem from "../listitem/CreatorListItem";

const CreatorFilter = ({currentCreator, setCurrentCreator, useCreator}) => {
  const { 
    data: auctionCreators, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, isError, error 
  } = useCreator();
  const [filterCreatorsOpen, setFilterCreatorsOpen] = useState(false);
  const [filterCreator, setFilterCreator] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    startTransition(() => {
      if(filterCreator == "") {
        setFilteredData(auctionCreators?.pages?.map(p => (p?.data)) ?? []);
      } else {
        setFilteredData(auctionCreators?.pages?.map(p => (
          p?.data?.filter(d => 
            d?.username?.toLowerCase()?.includes(filterCreator.toLowerCase()) ||
            d?.address?.toLowerCase()?.includes(filterCreator.toLowerCase())
          )
        )));
      }
    });
  }, [auctionCreators, filterCreator]);
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

  const CreatorListComp = useMemo(() => () => {
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
              <Box key={data.address}>
                <Box>
                  <CreatorListItem {...{currentCreator, setCurrentCreator, data}}/>
                </Box>
                <Box py={1}></Box>
              </Box>
            ))
          })
        }
        {
          ((filteredData.length <= 0 || !filteredData?.[0]?.[0]) && !hasNextPage) && (
            <Box pt={0.5}>
              <Empty title={"There is no creators!"}/>
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
                      filterCreator ?
                      <div ref={ref}></div> :
                      <Box textAlign={"center"} pt={1}>
                        <Button disableRipple className="fontNomSize" variant="outlined" fullWidth 
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
  }, [currentCreator, hasNextPage, isFetchingNextPage, setCurrentCreator, ref, filteredData, error, isError, isLoading, isPending, fetchNextPage, filterCreator, isAutoFetching]
);

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}
        sx={{cursor: "pointer", "&:hover": { opacity: 0.7 }}}
        onClick={() => setFilterCreatorsOpen(!filterCreatorsOpen)}
      >
        <Box display="flex" alignItems="center" gap="10px">
          <FaUserAlt fontSize="large"/>
          <Typography fontWeight="500">CREATORS</Typography>
        </Box>
        {filterCreatorsOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
      </Box>
      <Box py={1}></Box>
      {
        filterCreatorsOpen && 
        <>
          <TextField placeholder="Filter"
            fullWidth
            value={filterCreator}
            onChange={(event) => {
              setFilterCreator(event.target.value);
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
          <CreatorListComp/>
          <Box py={1}></Box>
        </>
      }
    </>
  )
}

export default CreatorFilter;