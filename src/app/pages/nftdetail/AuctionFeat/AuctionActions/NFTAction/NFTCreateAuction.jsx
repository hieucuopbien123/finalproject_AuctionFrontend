import { Box } from "@mui/material";
import React, { useState } from "react";
import AuctionCreation from "src/app/components/auctioncreation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAppContext } from "src/context/useAppContext";
import toast from "react-hot-toast";

const NFTCreateAuction = ({data, nftAmount}) => {
  const { colorMode: { currentMode } } = useAppContext();
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
      }
    }
  });
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash
  });
  const isLoading = isConfirming || isPending;

  return (
    <>
      <Box p={3} backgroundColor={currentMode == "dark" ? "#23262f" : "#fcfcfd"} borderRadius="10px" border={"1px solid"} borderColor={currentMode == "dark" ? "#2f2f2f" : "#e6e8ec"}>
        <AuctionCreation 
          nftAmount={{ [`${data.token_address}_${data.token_id}`]: nftAmount }}
          setAuctionType={setAuctionType} data={[data]} writeContract={writeContract} isLoading={isLoading}
        />
      </Box>
    </>
  )
}

export default NFTCreateAuction;