import { Box, Skeleton } from "@mui/material";
import React from "react";
import TrendingCard from "./TrendingCard";
import Flickity from 'react-flickity-component'
import useCollectionList from "src/hooks/reactquery/useCollectionList";
import { FailToLoad } from "src/app/components/error";

const flickityOptions = {
  initialIndex: 2,
  autoPlay: false,
  draggable: false,
  wrapAround: true
}
const rowsPerPage = 50;

const CollectionList = () => {
  const { data: collectionList, isError, error, isLoading } = useCollectionList({ first: rowsPerPage, skip: rowsPerPage*0 });

  if(isLoading) {
    return <Box display="flex" gap="20px">
      {
        [1,2,3,4].map(c => (
          <Box position="relative">
            <Skeleton variant="rounded" width={324} height={324} sx={{borderRadius: "15px"}}/>
          </Box>
        ))
      }
    </Box> 
  }

  if(isError) {
    return <FailToLoad size="3rem" className="fontSmallSize" title={`Network error: ${error.message}`}/>
  }

  return (
    <Box px={0}>
      {
        collectionList?.data.length < 5 ?
        <Box display="flex" gap="20px" overflow="scroll" pb={2}>
          {
            collectionList?.data?.map(c => (
              <Box position="relative">
                <TrendingCard data={c}/>
              </Box>
            ))
          }
        </Box> : 
        <Flickity
          className={'carousel'} 
          elementType={'div'}
          options={flickityOptions} 
          disableImagesLoaded={false}
          reloadOnUpdate
          static
        >
          {
            collectionList?.data?.map(c => (
              <Box px={1.5}>
                <TrendingCard data={c}/>
              </Box>
            ))
          }
        </Flickity>
      }
    </Box>
  )
}

export default CollectionList;