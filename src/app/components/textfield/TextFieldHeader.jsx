import { Box, ClickAwayListener, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppContext } from "src/context/useAppContext";
import GlobalSearch from "./GlobalSearch";
import { useEffect } from "react";

const TextFieldHeader = () => {
  const [text, setText] = useState("");
  const { colorMode } = useAppContext();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if(!text.trim()) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [text]);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box position="relative">
        <TextField
          fullWidth
          onFocus={() => { if(text.trim()) setOpen(true) }}
          value={text}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "20px",
              background: colorMode.currentMode == "dark" ? "#23262f" : "#f4f5f6",
              zIndex: -1,
              border: "2px solid",
              borderColor: colorMode.currentMode == "dark" ? "#23262f" : "#f4f5f6",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colorMode.currentMode == "dark" ? "#777e90" : "gray",
            },
            "& .MuiOutlinedInput-root": {
              height: "48px",
            },
            input: { 
              color: colorMode.currentMode == "dark" ? '#f3f4f5' : '#555a68', 
              fontWeight: "bold", 
              fontSize: "large" 
            }
          }}
          autoComplete="off"
          onChange={(e) => setText(e.target.value)}
          placeholder="Search address"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchSharpIcon style={{
              color: colorMode.currentMode == "dark" ? "#515562" : "#c3c7d4"
            }}/></InputAdornment>,
            endAdornment: <InputAdornment position="end">
              {
                text &&
                <ClearIcon sx={{
                    "&:hover": {
                      cursor: 'pointer'
                    }
                  }} 
                  style={{
                    color: colorMode.currentMode == "dark" ? "#515562" : "#c3c7d4"
                  }}
                  onClick={() => setText('')}
                />
              }
            </InputAdornment>,
          }}
        />
        <GlobalSearch searchTerms={text} open={open} setOpen={setOpen}/>
      </Box>
    </ClickAwayListener>
  )
}

export default TextFieldHeader;