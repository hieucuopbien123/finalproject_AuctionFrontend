import { Button, CircularProgress, styled } from "@mui/material";
import React from "react";
const CustomButton = styled(Button)({
  backgroundColor: "#3772ff",
  fontWeight: "bold",
  transition: "0.3s all",
  fontFamily: "Poppins",
  "&:hover": {
    backgroundColor: "#2555d9"
  },
  borderRadius: "20px",
  textTransform: "none",
  minWidth: "96px",
  marginTop: "20px",
  color: "white"
});

const CreateActionButton = ({ isLoading, onClick }) => {
  return (
    <CustomButton variant="contained" className="fontNomSize" 
      onClick={() => onClick()} fullWidth disabled={isLoading}
    >
      {isLoading ? <CircularProgress style={{color: "#9e9fa6"}} size={"30px"}/> : "CREATE" }
    </CustomButton>
  )
}

export default CreateActionButton;