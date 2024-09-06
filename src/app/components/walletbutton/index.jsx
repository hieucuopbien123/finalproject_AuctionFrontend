import { Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletButton = ({notShowChain = false}) => {
  return (
    <Box 
      sx={{
        '& button': {
          boxShadow: "none !important",
          fontSize: "14px !important",
          fontWeight: "500 !important",
          backgroundColor: "transparent !important",
        },
        '& button[data-testid="rk-connect-button"]': {
          background: "#E5E5EA !important",
          color: "#777e90 !important",
        },
        "& div": {
          whiteSpace: "nowrap !important",
          border: "none !important",
          color: "#777e90 !important",
        },
        "& path": {
          stroke: "#777e90 !important",
        },
        '& > div': {
          gap: "0px !important"
        }
      }}
    >
      <ConnectButton label="Connect" chainStatus={notShowChain ? "none" : {smallScreen: "icon", largeScreen: "full"}} accountStatus={{smallScreen: "avatar", largeScreen: "full"}} showBalance={false}/>
    </Box>
  )
}

export default WalletButton;