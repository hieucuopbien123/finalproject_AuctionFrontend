import { Box, Divider, Paper, Skeleton } from "@mui/material";

const SkeletonCards = ({gridMode = 0, pageSize = 20}) => {
  return (
    <>
      {
        new Array(pageSize).fill(1).map((_, index) => (
          <Paper elevation={3} key={index} sx={{borderRadius: "15px", overflow: "hidden", position: "relative", maxWidth: "290px"}}> 
            <Box width={"100%"} sx={{aspectRatio: "1/1"}}>
              <Skeleton variant="rectangular" width={"100%"} height="100%" />
            </Box>
            <Box px={gridMode == 0 ? 2 : 1} pt={gridMode == 0 ? 1 : 0.5}>
              <Skeleton width={"100%"}/>
            </Box>
            <Box px={gridMode == 0 ? 2 : 1}>
              <Skeleton width={"100%"}/>
            </Box>
            <Box px={gridMode == 0 ? 2 : 1} py={gridMode == 0 ? 1 : 0.5}>
              <Divider/>
              <Skeleton width={"100%"} height="37px"/>
            </Box>
          </Paper>
        ))
      }
    </>
  )
}

export default SkeletonCards;