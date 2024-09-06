import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import React from "react";
import { GrStatusInfo } from "react-icons/gr";

const StatusFilter = ({setStatus, status}) => {
  return (
    <>
      <Box display="flex" alignItems="center" gap="10px" pb={1}>
        <GrStatusInfo fontSize="large"/>
        <Typography fontWeight="500">STATUS</Typography>
      </Box>
      <RadioGroup
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <FormControlLabel width={"10px"} value={0} control={<Radio />} label={<Typography fontSize={"18px"}>Running auctions</Typography>} />
        <FormControlLabel value={1} control={<Radio />} label={<Typography fontSize={"18px"}>Deleted auctions</Typography>}  />
      </RadioGroup>
      <Box py={1.5}/>
    </>
  )
}

export default StatusFilter;