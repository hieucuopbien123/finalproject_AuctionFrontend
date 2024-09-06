import { config } from '../callconfig';
import { readContract } from '@wagmi/core';
import WETHContractABI from "src/api/contracts/abi/WETHABI.json";
import { addresses } from '../addresses';

const getWrapTokenBalance = async ({ userAddress }) => {
  const data = await readContract(config, {
    address: addresses.WETH,
    abi: WETHContractABI,
    functionName: "balanceOf",
    args: [userAddress]
  });
  return data;
}

export {
  getWrapTokenBalance
}

