import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useAppContext } from "./context/useAppContext";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import LaunchIcon from '@mui/icons-material/Launch';

const EachTx = ({tx}) => {
  const toastId = useRef(null);
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ 
    hash: tx.hash,
  });
  const queryClient = useQueryClient();
  const { callRefetch, popTx } = useAppContext();
  const { chain } = useAccount();
  useEffect(() => {
    if(toastId.current) {
      toast.dismiss(toastId.current);
    }
    if(isError){
      toast.error("Error::", error?.slice(0, 50));
      popTx(tx);
    } else if(isSuccess) {      
      toast('Tx confirmed!!', {
        icon: <a target='_blank' href={`${chain?.blockExplorers?.default?.url}/tx/${tx.hash}`}>
          <LaunchIcon/>
        </a>
      });
      if(tx.refetchQueries?.length > 0){
        toastId.current = toast.loading("Refetching data...", { duration: 12000});
        setTimeout(() => {
          setTimeout(() => {
            if(toastId.current) {
              toast.dismiss(toastId.current);
            }
          }, 5000);
          for(let i = 0; i < tx.refetchQueries?.length; i++){
            queryClient.invalidateQueries({ queryKey: tx.refetchQueries[i] });
          }
          callRefetch(); // Tx confirm -> call lại sau 10s -> 5s -> 5s
          popTx(tx);
        }, tx.delay ?? 10000);
      }
    } else if(isLoading) {
      toastId.current = toast.loading("Tx confirm....", { duration: 30000});
    }
  }, [isLoading, isError, isSuccess, popTx, callRefetch, queryClient, tx, error]); // eslint-disable-line

  return (
    <></>
  )
}

const TransactionStatus = () => {
  const { getTx } = useAppContext();
  const txs = getTx();
  return (
    <Box>
      {
        txs?.map((tx, index) => (
          <EachTx key={`${index}_${tx.hash}`} tx={tx}/>
        ))
      }
    </Box>
  )
}

export default TransactionStatus;