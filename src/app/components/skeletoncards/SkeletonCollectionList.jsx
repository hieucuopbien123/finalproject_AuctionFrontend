import { Box, Skeleton } from "@mui/material";

const SkeletonCollectionList = ({pageSize = 1}) => {
  return (
    <>
      {
        new Array(pageSize).fill(1).map((_, index) => (
          <Box key={index} display={"flex"} gap="10px" alignItems="center" mb={0.5}>
            <Skeleton height="30px" width={"20px"}/>
            <Skeleton variant="circular" width={35} height={35}/>
            <Skeleton height="35px" width="100%" sx={{flexShrink: "10"}}/>
          </Box>
        ))
      }
    </>
  )
}

export default SkeletonCollectionList;