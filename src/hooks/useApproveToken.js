import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getAllowance } from "src/api/contracts/interaction/ERC20MockContract";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import erc20mockcontractabi from "src/api/contracts/abi/ERC20MockContractABI.json";

export function useApproveToken({callback, paymentToken, approvedAddress, amount}) {
  const toastId = useRef(null);
  const account = useAccount();
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
      toast.success("Approved!");
      callback();
    } else if(isLoading) {
      toastId.current = toast.loading("Tx confirm....", { duration: 30000});
    }
  }, [isLoading, isError, isSuccess, error]); // eslint-disable-line
  const callWithApprove = useCallback(async () => {
    const allowance = await getAllowance({
      ownerAddress: account.address,
      spenderAddress: approvedAddress,
      tokenAddress: paymentToken,
    });
    if(allowance < amount){
      writeContract({
        abi: erc20mockcontractabi,
        address: paymentToken,
        functionName: 'approve',
        args: [approvedAddress, amount.toString()]
      });
    } else {
      callback();
    }
  }, [account.address, callback, writeContract, paymentToken, approvedAddress, amount]);
  return {
    callWithApprove,
    isLoadingApprove: isPending || isLoading
  }
}
