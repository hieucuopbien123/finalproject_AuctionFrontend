import { IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppContext } from "src/context/useAppContext";

function ColorModeButton() {
  const { colorMode } = useAppContext();
  const switchMode = () => {
    colorMode.setColorMode(!(colorMode.currentMode == "dark"));
  }
  return (
    <>
      <IconButton onClick={switchMode}>
        { colorMode.currentMode == "dark" ? <DarkModeIcon style={{color: "gray"}}/> : <LightModeIcon/> }
      </IconButton>
    </>
  )
}

export default ColorModeButton;
