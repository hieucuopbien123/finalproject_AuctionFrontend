import { Box, Container, Divider, Grow, IconButton } from "@mui/material";
import React from "react";
import SpecialButtonHeader from "src/app/components/button/SpecialButtonHeader";
import ButtonHeader from "src/app/components/button/ButtonHeader";
import Logo from "src/app/components/logo";
import TextFieldHeader from "src/app/components/textfield/TextFieldHeader";
import ColorModeButton from "src/app/components/colormodebutton";
import WalletButton from "src/app/components/walletbutton";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useAppContext } from "src/context/useAppContext";
import CloseIcon from '@mui/icons-material/Close';
import UtilButton from "src/app/components/utilbutton";

const Header = () => {
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const matches = useMediaQuery('(max-width:1150px)');
  const matches2 = useMediaQuery('(max-width:550px)');
  return (
    <>
      <Container maxWidth="xxl">
        <Box display={"flex"} alignItems={"center"} gap="15px" height="80px">
          <Logo to="/"/>
          <Box display={"flex"} gap="5px" alignItems={"center"} flexGrow={1}>
            {
              !matches && (
                <>
                  <ButtonHeader text={"Auctions"} to="/auctionlist"/>
                  <ButtonHeader text={"Collections"} to="/collectionlist"/>
                </>
              )
            }
            <Box flexGrow={1} px={1}>
              <TextFieldHeader />
            </Box>
            {
              !matches && (
                <>
                  <ButtonHeader text={"Profile"} 
                    to={account.address ? "/userdetail/" + account.address : false} 
                    onClick={() => {
                      if(!account.address) {
                        openConnectModal();
                      }
                    }}
                />
                  <SpecialButtonHeader text={"Guide"} to="/auctiontutorial" />
                </>
              )
            }
            {
              !matches2 && (
                <>
                  <ColorModeButton/>
                  <WalletButton notShowChain={true}/>
                </>
              ) 
            }
            {
              !matches && (
                <>
                  <UtilButton/>
                </>
              )
            }
            <MenuBar matches={matches} matches2={matches2}/>
          </Box>
        </Box>
      </Container>
      <Divider/>
    </>
  )
};

const MenuBar = ({matches, matches2}) => {
  const [open, setOpen] = useState(false);
  const { colorMode: { currentMode } } = useAppContext();
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  return (
    <>
      {
        matches && 
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon/>
        </IconButton>
      }
      {
        open &&
        <Grow in={open}>
          <Box sx={{
            position: "fixed", top: 0, left: 0, bottom: 0, right: 0, zIndex: 100, 
            backgroundColor: currentMode == "dark" ? "black" : "white", 
            width: "100%", height: "100%"
          }}>
            <Box p={3} position={"absolute"}>
              <IconButton >
                <CloseIcon sx={{fontSize: "40px"}} onClick={() => setOpen(false)}/>
              </IconButton>
            </Box>
            <Box height="100%" overflow="scroll">
              <Box display="flex" gap="10px" alignItems="center" justifyContent="center" flexDirection="column" height="80%">
                <ButtonHeader text={"Auctions"} to="/auctionlist" width="200px" onClick={() => setOpen(false)}/>
                <ButtonHeader text={"Collections"} to="/collectionlist" onClick={() => setOpen(false)}/>
                <>
                  <ButtonHeader text={"Profile"}
                    to={account.address ? "/userdetail/" + account.address : false}
                    onClick={() => {
                      setOpen(false);
                      if(!account.address) {
                        openConnectModal();
                      }
                    }}
                />
                  <SpecialButtonHeader text={"Guide"} to="/auctiontutorial" />
                </>
                <ColorModeButton/>
                <WalletButton/>
              </Box>
            </Box>
          </Box>
        </Grow>
      }
    </>
  )
}

export default Header;