import * as React from 'react';
import { Box, TextField } from '@mui/material';
import Decimal from 'decimal.js';
Decimal.set({ precision: 18 });

const CustomNumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <Box sx={{
      "& input": {
        width: props.width
      }
    }}>
      <TextField
        type="number"
        hiddenLabel
        size='small'
        ref={ref}
        {...props}
        sx={{border: "none"}}
        InputProps={{
          inputProps: { min: 0, style: {opacity: "0.9"} },
          ...props.InputProps
        }}
      />
    </Box>
  );
});

export default function NumberInput({value, setValue, width, ...props}) {
  return (
    // <CustomNumberInput {...props} value={value} onChange={(e) => {
    //   if(e.target.value == ""){
    //     setValue(e.target.value);
    //     return;
    //   }
    //   let sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
    //   sanitizedValue = sanitizedValue.replace(/[-e]/g, '');
    //   let floatValue = new Decimal(sanitizedValue);
    //   setValue(floatValue);
    // }} width={width ?? "70px"}/>
    <CustomNumberInput {...props} value={value} onChange={(e) => {
      if(e.target.value === ""){
        setValue(e.target.value);
        return;
      }
      let sanitizedValue = e.target.value.replace(/[^0-9.]/g, ''); // Allow digits and decimal point
      if (sanitizedValue.split('.').length > 2) { // Check if more than one decimal point
        sanitizedValue = sanitizedValue.replace(/\.+$/, ''); // Remove extra decimal points
      }
      let floatValue = parseFloat(sanitizedValue); // Use parseFloat to handle floating numbers
      setValue(floatValue);
    }} width={width ?? "70px"}/>
  );
}