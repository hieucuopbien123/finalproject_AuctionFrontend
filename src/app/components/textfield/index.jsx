import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

const TextFieldFilter = ({ searchTerms, setSearchTerms, placeholderText, ...props }) => {
  return (
    <>
      <TextField {...props} size="small" value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)}
        placeholder={placeholderText} sx={{
          minWidth: "min(max(100%, 200px),400px)",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "2px solid",
            borderColor: "#d0d1d4"
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d0d1d4"
          },
        }} 
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <CloseIcon fontSize="small" sx={{cursor: "pointer"}} onClick={() => setSearchTerms("")}/>
          </InputAdornment>
        }}
      />
    </>
  )
}

export default TextFieldFilter;