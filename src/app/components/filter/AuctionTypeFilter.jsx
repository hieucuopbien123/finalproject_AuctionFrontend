import { Box, Checkbox, Typography } from "@mui/material";
import React, { useState, useTransition } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FaRegListAlt } from "react-icons/fa";

const configs = [
  {
    name: "English auction",
    value: "0",
  },
  {
    name: "Vickrey auction",
    value: "1",
  },
  {
    name: "Dutch auction",
    value: "2",
  },
  {
    name: "Sealed bid auction v1",
    value: "3",
  },
  {
    name: "Sealed bid auction v2",
    value: "4",
  },
]

const AuctionTypeFilter = ({auctionTypeFilter, setAuctionTypeFilter}) => {
  const [auctionTypeFilterOpen, setAuctionTypeFilterOpen] = useState(true);
  const [_, startTransition] = useTransition();
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}
        sx={{cursor: "pointer", "&:hover": { opacity: 0.7 }}}
        onClick={() => setAuctionTypeFilterOpen(!auctionTypeFilterOpen)}
      >
        <Box display="flex" alignItems="center" gap="10px">
          <FaRegListAlt fontSize="large"/>
          <Typography fontWeight="500">AUCTION TYPE</Typography>
        </Box>
        {auctionTypeFilterOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
      </Box>
      <Box pt={0.5}></Box>
      {
        auctionTypeFilterOpen && 
        <>
          {
            configs.map(c => (
              <Box display="flex" alignItems={"center"} key={c.name}
                onClick={() => {
                  startTransition(() => {
                    if(auctionTypeFilter.includes(c.value)){
                      setAuctionTypeFilter(auctionTypeFilter.filter(v => v !== c.value))
                    } else {
                      setAuctionTypeFilter([...auctionTypeFilter, c.value])
                    }
                  })
                }}
                sx={{
                  "&:hover": {
                    opacity: 0.8,
                    cursor: "pointer"
                  }
              }}>
                <Checkbox sx={{transform: "translateX(-10px)", opacity: 0.8}} disableRipple checked={auctionTypeFilter.includes(c.value)}/>
                <div>{c.name}</div>
              </Box>
            ))
          }
        </>
      }
      <Box py={1}></Box>
    </>
  )
}

export default AuctionTypeFilter;