import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { formatAddress, formatID } from "src/utils";
import AuctionCreation from "src/app/components/auctioncreation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAppContext } from "src/context/useAppContext";
import toast from "react-hot-toast";
import CloseIcon from '@mui/icons-material/Close';
import { getBackupNFTName } from "../../utils";
import NumberInput from "src/app/components/input/NumberInput";
import Grid from '@mui/material/Grid';
import ImageView from "../ImageView";
import CustomTooltip from "src/app/components/tooltip";

const CreateAuctionDialog = ({dialogIsOpen, openDialog, data, nftImage}) => {
  const theme = useTheme();
  const { pushTx } = useAppContext();
  const account = useAccount();
  const [auctionType, setAuctionType] = useState(0);
  const { data: hash, isPending, writeContract } = useWriteContract({
    mutation: {
      onError: (e) => {
        toast.error(e.shortMessage || e.message.slice(0, 50));
      },
      onSuccess: (x) => {
        pushTx({
          [x]: {
            hash: x,
            refetchQueries: [
              ["auction", auctionType],
              ["auctionStats", auctionType],
              ["user", account.address]
              ["userNFTs", account.address],
            ]
          },
        });
        openDialog(false);
      }
    }
  });
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;
  const [nftAmount, setNFTAmount] = useState(data.amount);

  return (
    <>
      <Dialog
        maxWidth="lg"
        open={dialogIsOpen}
        onClose={() => openDialog(false)}
        fullWidth={true}
      >
        <DialogTitle sx={{px: 5}} textAlign="center" fontFamily={"Poppins"} fontWeight={"bold"} position={"relative"}>
          Create new auction for NFT #{formatID(data.token_id)}
          <IconButton onClick={() => openDialog(false)} sx={{
              position: "absolute",
              top: 9,
              right: 8
            }}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container columnSpacing={{xs: 0.5}}>
            <Grid item xs={3}>
              <Box display={"flex"} justifyContent={"center"}>
                <ImageView nftImage={nftImage} borderRadius="10px" overflow="hidden" width="90%"/>
              </Box>
              <Box pt={1}></Box>
              <Typography fontWeight="bold" textAlign={"center"} className="bigTextSize limitText">{data?.normalized_metadata?.name ?? getBackupNFTName({data})}</Typography>
              <CustomTooltip text={data?.token_address}>
                <Typography className="fontNomSize limitText" sx={{
                  color: theme.palette.primary.main, fontFamily: "Poppins",
                  textAlign: "center"
                }}>{`${data?.name ? data?.name : formatAddress(data?.token_address)} ${!!data?.symbol ? `(${data?.symbol})` : ""}`}</Typography>
              </CustomTooltip>
              <Box pt={1}></Box>
              {
                data.amount > 1 && 
                <Box display={"flex"} alignItems={"center"} margin={"0 auto"} justifyContent={"center"}>
                  <Typography className="fontNomSize" fontFamily={"Poppins"} fontWeight={"bold"}>
                    Amount:&nbsp;&nbsp;
                  </Typography>
                  <NumberInput width={"50px"} value={nftAmount} setValue={setNFTAmount}/>
                </Box>
              }
            </Grid>
            <Grid item xs={9}>
              <AuctionCreation 
                nftAmount={{ [`${data.token_address}_${data.token_id}`]: nftAmount }}
                setAuctionType={setAuctionType} data={[data]} writeContract={writeContract} isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateAuctionDialog;