import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import erc721abi from "src/api/contracts/abi/NFTCoreABI.json";

export function useApproveNFTs({callback, targetAddress}) {
  const toastId = useRef(null);
  const { data: hash, isPending: isPending, writeContract: writeContract } = useWriteContract({
    mutation: {
      onError: (e) => {
        toast.error(e.shortMessage || e.message.slice(0, 50));
      }
    }
  });
  const { isLoading: isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ 
    hash: hash,
  });
  useEffect(() => {
    if(toastId.current) {
      toast.dismiss(toastId.current);
    }
    if(isError){
      toast.error("Error::", error?.slice(0, 50));
    } else if(isSuccess) {  
      toast.dismiss(toastId.current);
      toast.success("Tx done!");
      callback();
    } else if(isLoading) {
      toastId.current = toast.loading("Tx confirm....", { duration: 30000});
    }
  }, [isLoading, isError, isSuccess, error]); // eslint-disable-line
  const approve = useCallback(async ({nftAddress}) => {
    writeContract({
      abi: erc721abi,
      address: nftAddress,
      functionName: 'setApprovalForAll',
      args: [targetAddress, true]
    });
  }, [targetAddress, writeContract]);
  const revoke = useCallback(async ({nftAddress}) => {
    writeContract({
      abi: erc721abi,
      address: nftAddress,
      functionName: 'setApprovalForAll',
      args: [targetAddress, false]
    });
  }, [targetAddress, writeContract]);
  return {
    approve,
    revoke,
    isLoadingApprove: isPending || isLoading
  }
}
