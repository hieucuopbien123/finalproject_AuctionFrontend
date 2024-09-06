import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useCallback } from "react";
import { getApprovedForAll721 } from "src/api/contracts/interaction/NFTCoreContract";
import { addresses } from "src/api/contracts/addresses";
import { useApproveNFTs } from "src/hooks/useApproveNFTs";

const ApproveButton = (
  {nftAddress, setApprovedList}
) => {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const checkApprove = useCallback(async () => {
    setIsLoading(true);
    const data = await getApprovedForAll721({nftAddress, ownerAddress: account.address, targetAddress: addresses.AuctionFactory});
    setIsApproved(data);
    setIsLoading(false);
    if(data == true) {
      setApprovedList(prevItems => {
        if (prevItems.indexOf(nftAddress) === -1) {
          return [...prevItems, nftAddress];
        }
        return prevItems;
      });
    }
    if(data == false) {
      setApprovedList(approvedList => approvedList.filter(a => a != nftAddress));
    }
  }, [nftAddress, account.address, setApprovedList]);
  useEffect(() => {
    checkApprove();
  }, [checkApprove]);
  const {approve, revoke, isLoadingApprove} = useApproveNFTs({callback: () => checkApprove(), targetAddress: addresses.AuctionFactory});

  return (
    <>
      <Button variant="outlined" disabled={isLoading || isLoadingApprove} sx={{minWidth: "127px"}} onClick={() => {
        if(isApproved) revoke({nftAddress})
        else approve({nftAddress})
      }}>{
        (isLoading || isLoadingApprove) ? <CircularProgress style={{color: "#9e9fa6"}} size={"25px"}/> : 
        (isApproved ? "Revoke" : "Approve for all")
      }</Button>
    </>
  )
}

export default ApproveButton;