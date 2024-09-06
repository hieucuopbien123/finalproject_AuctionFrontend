import { IconButton } from "@mui/material";
import React from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { debounce } from "lodash";
import toast from "react-hot-toast";

const RefetchButton = ({refetchFunc, message = "Refetch data", ...props}) => {
  const debouncedRefetch = debounce(() => refetchFunc(), 2000);
  return (
    <>
      <IconButton size="large" onClick={() => {
        debouncedRefetch();
        toast.success(message, {
          duration: 2000
        });
      }} {...props}><RefreshIcon className="titleSize"/></IconButton>
    </>
  )
}

export default RefetchButton;