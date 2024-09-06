import { Box } from "@mui/material";
import React from "react";

const PageLoading = () => {
  return (
    <Box style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 82px)"}}>
      <div className="loading"></div>
    </Box>
  );
};

export default PageLoading;