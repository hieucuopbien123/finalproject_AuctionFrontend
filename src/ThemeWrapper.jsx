import React from "react";
import { CssBaseline, createTheme } from "@mui/material";
import { useAppContext } from "src/context/useAppContext";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

const getComponentsStyle = (mode) => {
  if(mode == "light") {
    return {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#291334",
          }
        }
      }
    }
  } else if(mode == "dark") {
    return {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#f8f8f3",
          }
        }
      }
    }
  }
};

export default function ThemeWrapper({children}) {
  const { colorMode: { currentMode } } = useAppContext();

  const theme = React.useMemo(() => 
    createTheme({
      palette: {
        mode: currentMode,
        background: {
          default: currentMode == "dark" ? "#282a36" : "#ffffff",
          paper: currentMode == "dark" ? "#282a36" : "#ffffff",
          
        },
        primary: {
          main: "#777e90"
        },
        secondary: {
          main: currentMode == "dark" ? "#ffffffed" : "#000000d1"
        },
        customDark: "#000000d1",
        customLight: "#ffffffed",
        customBg: currentMode == "dark" ? "#414558" : "#fcf9f7",
        customBorder: currentMode == "dark" ? "#2f2f2f" : "#e6e8ec",
      },
      typography: {
        fontFamily: "ui-sans-serif, system-ui, Inter",
      },
      components: {
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: "none",
            }
          }
        },      
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none"
            }
          }
        },
        MuiPaper: {
          styleOverrides: { root: { backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))" } },
        },
        ...getComponentsStyle(currentMode)
      }
    })
  , [currentMode]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
