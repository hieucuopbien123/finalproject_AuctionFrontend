import { config } from '../callconfig';
import { readContract } from '@wagmi/core';
import erc20MockContractABI from "src/api/contracts/abi/ERC20MockContractABI.json";

const getAllowance = async ({ ownerAddress, spenderAddress, tokenAddress }) => {
  const data = await readContract(config, {
    address: tokenAddress,
    abi: erc20MockContractABI,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress]
  });
  return data;
}

export {
  getAllowance
}

